const express = require("express");
const multer = require("multer");
const { MongoClient, GridFSBucket, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const keyManagement = require("../services/keyManagement");
const fileEncryption = require("../services/fileEncryption");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

let db;
let bucket;

async function initializeMongoDB() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db("medibase");
    bucket = new GridFSBucket(db, {
      bucketName: "encryptedFiles",
    });
    console.log("GridFS bucket initialized successfully in fileRoutes");
  } catch (error) {
    console.error("MongoDB/GridFS initialization error:", error);
    throw error;
  }
}

// Initialize MongoDB connection
initializeMongoDB().catch(console.error);

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const user = await db.collection("userData").findOne({ username });

  if (!user) {
    return res.status(404).json({ error: "User doesn't exist" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  const sessionID = uuidv4();

  //convert it into IST 
  const nowUTC = new Date();
  const oneHourFromNowUTC = new Date(nowUTC.getTime() + 60 * 60 * 1000);
  const istOffset = 5.5 * 60 * 60 * 1000; // IST = UTC +5:30
  const expiresAt = new Date(oneHourFromNowUTC.getTime() + istOffset);

  await db.collection("userData").updateOne(
    { _id: user._id },
    {
      $set: {
        sessionID,
        expiresAt,
      },
    }
  );

  res.status(200).json({
    message: "Login successful",
    userId: user._id.toString(),
    username: user.username,
    sessionID,
  });
});

router.post("/validate-user-session", async (req, res) => {
  const { sessionID } = req.body;

  const user = await db.collection("userData").findOne({ sessionID });

  // If no matching user/session
  if (!user || !user.expiresAt) {
    return res.status(401).json({ valid: false });
  }

  // Get current IST time
  const nowUTC = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in ms
  const nowIST = new Date(nowUTC.getTime() + istOffset);

  const expiresAt = new Date(user.expiresAt);

  // Check if session expired
  if (expiresAt < nowIST) {
    // Clean up expired session
    await db.collection("userData").updateOne(
      { _id: user._id },
      { $unset: { sessionID: "", expiresAt: "" } }
    );

    return res.status(401).json({ valid: false, message: "Session expired" });
  }

  // Session is valid
  return res.status(200).json({ valid: true });
});


router.post("/logout", async (req, res) => {
  const { sessionID } = req.body;

  await db.collection("userData").updateOne(
    { sessionID },
    { $unset: { sessionID: "", expiresAt: "" } }
  );

  res.json({ message: "Logged out successfully" });
});


router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if username already exists
    const existingUser = await db.collection("userData").findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists." });
    }

    // Check if email already exists
    const existingEmail = await db.collection("userData").findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: "Email already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const result = await db.collection("userData").insertOne({
      username,
      email,
      password: hashedPassword,
      categories: ["General", "Dental", "Ortho", "X-Ray"],
      fileCount: 0,
    });

    const userId = result.insertedId.toString();

    // Generate the root key
    const { encryptedRootKey } = await keyManagement.generateUserRootKey(userId);

    // Update the user with the encrypted root key
    await db.collection("userData").updateOne(
      { _id: result.insertedId },
      { $set: { userRootKey: encryptedRootKey } }
    );

    // Insert user into userSessionData
    await db.collection("userSessionData").insertOne({
      userId,
      emails: [],
    });

    console.log(`Created new user: ${userId}`);

    // Respond with success
    res.status(201).json({
      message: "User created successfully",
      userId,
      username,
    });

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});


// router.get("/verify-email-password-reset", async (req, res) => {
//   const { token } = req.query;

//   if (!token) {
//     return res.status(400).json({ error: "Token is required" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const email = decoded.email;

//     res.json({ email });
//   } catch (error) {
//     res.status(400).json({ error: "Invalid or expired token" });
//   }
// });


router.get("/verify-email-password-reset", async (req, res) => {
  const { token } = req.query;

  console.log("👉 Received token:", token);

  if (!token) {
    console.log("❌ No token provided");
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded token:", decoded);

    const email = decoded.email;
    if (!email) {
      console.log("❌ Token does not contain email");
      return res.status(400).json({ error: "Invalid token payload" });
    }

    res.json({ message: "Email verified successfully", email });
  } catch (error) {
    console.error("❌ JWT verification failed:", error.message);
    return res.status(400).json({ error: "Invalid or expired token" });
  }
});
router.post("/reset-password-backend", async (req, res) => {
  const { email, newPassword } = req.body;
  console.log("email : ",email)
  console.log("newPassword : ",newPassword)
  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.collection("userData").updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//this endpoint uploads file for that particular user
router.post("/upload/:userId", upload.single("file"), async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from the route parameter

    if (!db || !bucket) {
      return res
        .status(500)
        .json({ error: "Database connection not initialized" });
    }

    // Validate request
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const { category, fileName } = req.body;

    if (!category || !fileName) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["category", "fileName"],
      });
    }

    // Check if a file with the same name already exists for the user
    const existingFile = await db.collection("encryptedFiles.files").findOne({
      filename: fileName,
      "metadata.userId": userId,
    });

    if (existingFile) {
      return res.status(400).json({
        error: "A file with the same name already exists.",
      });
    }

    // Fetch the user's rootKey from the database
    const user = await db
      .collection("userData")
      .findOne({ _id: new ObjectId(userId) }); // Query userData using userId
    if (!user || !user.userRootKey) {
      return res.status(404).json({ error: "User or rootKey not found" });
    }

    const rootKeyBuffer = Buffer.from(user.userRootKey.value());
    const rootKey = await keyManagement.getRootKey(rootKeyBuffer);

    // Encrypt file
    console.log("Encrypting file:", fileName);
    const encryptedBuffer = await fileEncryption.encryptBuffer(
      req.file.buffer,
      rootKey
    );

    // Upload file using async/await and proper promise handling
    const fileId = await new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(fileName, {
        metadata: {
          category,
          userId,
          uploadedAt: new Date(),
          contentType: req.file.mimetype,
          originalName: req.file.originalname,
          size: req.file.size,
        },
      });

      // Handle upload events
      uploadStream.once("finish", function () {
        resolve(this.id); // 'this' refers to the upload stream
      });

      uploadStream.once("error", (error) => {
        reject(error);
      });

      // Write the encrypted buffer and close the stream
      uploadStream.write(encryptedBuffer);
      uploadStream.end();
    });

    // Check if the category already exists for the user
    const categoryExists = user.categories?.some(
      (cat) => cat.toLowerCase() === category.toLowerCase()
    );

    // Add the category if it doesn't exist
    if (!categoryExists) {
      await db.collection("userData").updateOne(
        { _id: new ObjectId(userId) }, // Find the user by userId
        { $addToSet: { categories: category } } // Add the category to the array if not already present
      );
    }

    // Increment the fileCount for the user
    await db.collection("userData").updateOne(
      { _id: new ObjectId(userId) }, // Find the user by userId
      { $inc: { fileCount: 1 } } // Increment the fileCount field by 1
    );

    // Send response with file information
    res.status(200).json({
      message: "File uploaded successfully",
      fileId: fileId.toString(), // Convert ObjectId to string
      fileName,
      category,
      contentType: req.file.mimetype,
      size: req.file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "File upload failed",
      details: error.message,
    });
  }
});

//This endpoint retrieves file based on userId and file name
router.get("/file/:userId/:fileName", async (req, res) => {
  try {
    const { userId, fileName } = req.params; // Extract userId and fileName from route parameters

    if (!userId || !fileName) {
      return res
        .status(400)
        .json({ error: "Missing required parameters: userId or fileName" });
    }

    // Fetch the user's rootKey from the database
    const user = await db
      .collection("userData")
      .findOne({ _id: new ObjectId(userId) }); // Query userData using userId
    if (!user || !user.userRootKey) {
      return res.status(404).json({ error: "User or rootKey not found" });
    }

    const rootKeyBuffer = Buffer.from(user.userRootKey.value());
    const rootKey = await keyManagement.getRootKey(rootKeyBuffer);

    // Find the file's metadata
    const file = await db
      .collection("encryptedFiles.files")
      .findOne({ filename: fileName, "metadata.userId": userId });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    console.log("Decrypting file:", fileName);
    // Stream the file from GridFS
    const downloadStream = bucket.openDownloadStreamByName(fileName);

    // Collect chunks into buffer
    const chunks = [];
    downloadStream.on("data", (chunk) => chunks.push(chunk));

    downloadStream.on("end", async () => {
      try {
        const encryptedBuffer = Buffer.concat(chunks);

        // Decrypt the file using the rootKey
        const decryptedBuffer = await fileEncryption.decryptBuffer(
          encryptedBuffer,
          rootKey
        );

        // Set content type and send the decrypted file
        res.set(
          "Content-Type",
          file.metadata.contentType || "application/octet-stream"
        );
        res.send(decryptedBuffer);
      } catch (err) {
        console.error("Error during file decryption:", err);
        res
          .status(500)
          .json({ error: "File decryption failed", details: err.message });
      }
    });

    downloadStream.on("error", (err) => {
      console.error("Error during file retrieval:", err);
      res.status(404).json({ error: "Error retrieving file" });
    });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

router.get("/files2/recent/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Missing required parameter: userId" });
    }

    // Fetch the user's rootKey from the database
    const user = await db
      .collection("userData")
      .findOne({ _id: new ObjectId(userId) });
    if (!user || !user.userRootKey) {
      return res.status(404).json({ error: "User or rootKey not found" });
    }

    const rootKeyBuffer = Buffer.from(user.userRootKey.value());
    const rootKey = await keyManagement.getRootKey(rootKeyBuffer);

    // Query the database for the top 6 most recently uploaded files
    const files = await db
      .collection("encryptedFiles.files")
      .find({ "metadata.userId": userId })
      .sort({ uploadDate: -1 }) // Sort by uploadDate in descending order
      .limit(6) // Limit to 6 files
      .toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: "No recent files found" });
    }

    const filePreviews = await Promise.all(
      files.map(async (file) => {
        try {
          const downloadStream = bucket.openDownloadStreamByName(file.filename);

          // Collect chunks from the download stream
          const chunks = [];
          return new Promise((resolve, reject) => {
            downloadStream.on("data", (chunk) => chunks.push(chunk));
            downloadStream.on("end", async () => {
              try {
                const encryptedBuffer = Buffer.concat(chunks);

                // Decrypt the file using the rootKey
                const decryptedBuffer = await fileEncryption.decryptBuffer(
                  encryptedBuffer,
                  rootKey
                );

                // Convert decrypted content to Base64 for preview
                const previewBase64 = decryptedBuffer.toString("base64");

                resolve({
                  filename: file.filename,
                  uploadDate: file.uploadDate,
                  preview: `data:${file.metadata.contentType};base64,${previewBase64}`,
                });
              } catch (err) {
                console.error("Error decrypting file:", err);
                reject(err);
              }
            });

            downloadStream.on("error", (err) => {
              console.error("Error reading file stream:", err);
              reject(err);
            });
          });
        } catch (err) {
          console.error("Error processing file:", file.filename, err);
          return null;
        }
      })
    );

    // Filter out any failed file previews
    const successfulPreviews = filePreviews.filter((preview) => preview !== null);

    res.json(successfulPreviews);
  } catch (err) {
    console.error("Error fetching recent files with previews:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

module.exports = router;
