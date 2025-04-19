const express = require("express");
const { ObjectId } = require("mongodb");
const { MongoClient } = require("mongodb");
const keyManagement = require("../services/keyManagement");
const { v4: uuidv4 } = require("uuid");
const CryptoJS = require("crypto-js");
const axios = require("axios");
const router = express.Router();

let db;

// Initialize MongoDB connection
async function initializeMongoDB() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db("medibase");
    console.log("MongoDB connected successfully in viewFilesRoutes");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

initializeMongoDB()

/**
 * Endpoint to fetch files grouped by category for a specific user
 */
router.get("/categories/:userId", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database connection not initialized" });
    }

    const userId = req.params.userId;

    const categories = await db.collection("encryptedFiles.files").aggregate([
      {
        $match: {
          "metadata.userId": userId, // Filter files by userId in metadata
        },
      },
      {
        $group: {
          _id: "$metadata.category", // Group by category
          files: {
            $push: {
              filename: "$filename",
              uploadDate: "$uploadDate",
              contentType: "$metadata.contentType",
            },
          },
        },
      },
      {
        $sort: { _id: 1 }, // Sort categories alphabetically
      },
    ]).toArray();

    // Handle missing or undefined categories gracefully
    const result = categories.map((category) => ({
      categoryName: category._id || "Uncategorized", // Default to "Uncategorized" if no category
      files: category.files.map((file) => ({
        filename: file.filename,
        uploadDate: file.uploadDate || null,
        contentType: file.contentType || "unknown",
      })),
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching files by category:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Endpoint to handle sending selected files
 */
// router.post("/sendFiles/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId; // Extract userId from the route parameter
//     const { selectedFiles, doctorName, doctorPhone, doctorEmail } = req.body; // Extract doctor details and files

//     if (!userId || !Array.isArray(selectedFiles) || selectedFiles.length === 0 || !doctorName || !doctorPhone || !doctorEmail) {
//       return res.status(400).json({ error: "Invalid request. Missing userId, files, or doctor details." });
//     }

//     // Log the received data
//     console.log(`User ID: ${userId}`);
//     console.log(`Doctor Name: ${doctorName}`);
//     console.log(`Doctor Phone: ${doctorPhone}`);
//     console.log(`Doctor Email: ${doctorEmail}`);
//     console.log(`Selected Files: ${selectedFiles.join(", ")}`);

//     // Send a success response
//     res.status(200).json({
//       message: "Files and doctor details processed successfully",
//       selectedFiles,
//       doctorDetails: { doctorName, doctorPhone, doctorEmail },
//     });
//   } catch (error) {
//     console.error("Error processing files:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

//send files to doctor and creates a sessionData object in inactive state
router.post("/sendFiles/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { selectedFiles, doctorName, doctorEmail } = req.body;

    // Validate input
    if (!userId || !Array.isArray(selectedFiles) || selectedFiles.length === 0 || !doctorName || !doctorEmail) {
      return res.status(400).json({ error: "Invalid request. Missing userId, files, or doctor details." });
    }

    // Fetch the user's encrypted root key from the userData collection
    const user = await db.collection("userData").findOne({ _id: new ObjectId(userId) });

    if (!user || !user.userRootKey) {
      return res.status(404).json({ error: "User or rootKey not found." });
    }
    // Convert the stored rootKey into a buffer
    const rootKeyBuffer = Buffer.from(user.userRootKey.value());

    // Decrypt the user's root key
    const rootKey = await keyManagement.getRootKey(rootKeyBuffer);

    const rootKeyString = rootKey.toString("utf-8"); 
    const encryptedDoctorEmail = CryptoJS.AES.encrypt(doctorEmail, rootKeyString).toString();

    // Generate a unique session ID
    const sessionId = uuidv4();

    // Insert the new session document directly into the SessionData collection
    await db.collection("sessionData").insertOne({
      sessionId,
      userId,
      doctorName, 
      doctorEmail: encryptedDoctorEmail, // Encrypted value
      sessionState: "Inactive", // Default state
      files: selectedFiles,
      createdAt: new Date(),
    });

    await axios.post(`http://localhost:3001/send-files-mail`, {
      doctorEmail,
      sessionId,
    });

    // Send success response
    res.status(200).json({
      message: "Session created and mail sent successfully",
      sessionId,
      userId,
      sessionState: "Inactive",
      doctorDetails: { doctorName, encryptedDoctorEmail},
      files: selectedFiles,
    });
  } catch (error) {
    console.error("Error creating session:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


/**
 * Endpoint to rename a file
 */
router.post("/renameFile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { fileId, newName } = req.body;


    // Check if a file with the new name already exists for this user
    const existingFile = await db.collection("encryptedFiles.files").findOne({
      filename: newName,
      "metadata.userId": userId,
    });

    if (existingFile) {
      return res.status(400).json({
        error: "A file with this name already exists.",
      });
    }

    // Proceed with renaming if no conflict
    const result = await db.collection("encryptedFiles.files").updateOne(
      { filename: fileId, "metadata.userId": userId }, // Match by filename and userId
      { $set: { filename: newName } }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ error: "File not found or not owned by the user." });
    }

    res.status(200).json({ message: "File renamed successfully." });
  } catch (error) {
    console.error("Error renaming file:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});



router.post("/changeFileCategory/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId
    const { fileId, newCategory } = req.body; // Extract fileId and newCategory from the body

    // Validate inputs
    if (!userId) {
      return res.status(400).json({ error: "Missing parameter: userId" });
    }
    if (!fileId || typeof fileId !== "string") {
      return res.status(400).json({ error: "Invalid or missing file ID" });
    }
    if (!newCategory || typeof newCategory !== "string") {
      return res.status(400).json({ error: "Invalid or missing category name" });
    }

    // Debug logs for input validation
    

    // Check if fileId is a valid ObjectId
    const isObjectId = ObjectId.isValid(fileId);
    const fileQuery = isObjectId
      ? { _id: new ObjectId(fileId), "metadata.userId": userId }
      : { filename: fileId, "metadata.userId": userId };

    // Debug log for file query
 

    // Query the file to ensure it exists and belongs to the user
    const file = await db.collection("encryptedFiles.files").findOne(fileQuery);

    if (!file) {
      console.error("File not found or not owned by the user.");
      return res.status(404).json({ error: "File not found or not owned by the user." });
    }

    // Query the user to check their categories
    const user = await db.collection("userData").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      console.error("User not found!");
      return res.status(404).json({ error: "User not found!" });
    }

    let updatedCategories = user.categories || [];

    // Check if the category exists (case-insensitive)
    const categoryExists = updatedCategories.some(
      (category) => category.toLowerCase() === newCategory.toLowerCase()
    );

    // Debug log for categories
 

    // Add the new category if it doesn't exist
    if (!categoryExists) {
      updatedCategories.push(newCategory);
      await db.collection("userData").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { categories: updatedCategories } }
      );
    }

    // Update the file's category
    const result = await db.collection("encryptedFiles.files").updateOne(
      fileQuery,
      { $set: { "metadata.category": newCategory } }
    );

    if (result.matchedCount === 0) {
      console.error("Failed to update file category.");
      return res.status(404).json({ error: "File not found or not owned by the user." });
    }

    // Debug log for update result
 

    // Success response
    return res.status(200).json({
      success: true,
      message: "File category updated successfully.",
      newCategory,
    });
  } catch (error) {
    console.error("Error changing file category:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/renameCategory/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldCategory, newCategory } = req.body;

    if (!userId || !oldCategory || !newCategory) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const trimmedOldCategory = oldCategory.trim();
    const trimmedNewCategory = newCategory.trim();

    // Check if the new category already exists (case-insensitive)
    const user = await db.collection("userData").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingCategory = user.categories.find(
      (cat) => cat.toLowerCase() === trimmedNewCategory.toLowerCase()
    );

    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    // Update the category in the user's categories array
    const userUpdateResult = await db.collection("userData").updateOne(
      { _id: new ObjectId(userId), categories: { $regex: `^${trimmedOldCategory}$`, $options: "i" } },
      { $set: { "categories.$": trimmedNewCategory } }
    );

    if (userUpdateResult.matchedCount === 0) {
      return res.status(404).json({ error: "Category not found for the given user" });
    }

    // Update all files' metadata where the category matches
    const fileUpdateResult = await db.collection("encryptedFiles.files").updateMany(
      { "metadata.userId": userId, "metadata.category": { $regex: `^${trimmedOldCategory}$`, $options: "i" } },
      { $set: { "metadata.category": trimmedNewCategory } }
    );

    res.status(200).json({
      success: true,
      message: "Category renamed successfully",
      filesUpdated: fileUpdateResult.modifiedCount,
    });
  } catch (error) {
    console.error("Error renaming category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.post("/deleteCategory/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { categoryToDelete } = req.body;

//     if (!userId || !categoryToDelete) {
//       return res.status(400).json({ error: "Missing parameters" });
//     }

//     const trimmedCategory = categoryToDelete.trim();

//     // Remove the category from the user's categories array
//     const userUpdateResult = await db.collection("userData").updateOne(
//       { _id: new ObjectId(userId) },
//       { $pull: { categories: { $regex: `^${trimmedCategory}$`, $options: "i" } } }
//     );

//     if (userUpdateResult.matchedCount === 0) {
//       return res.status(404).json({ error: "Category not found for the given user" });
//     }

//     // Update all files belonging to the deleted category to "General"
//     const fileUpdateResult = await db.collection("encryptedFiles.files").updateMany(
//       { "metadata.userId": userId, "metadata.category": { $regex: `^${trimmedCategory}$`, $options: "i" } },
//       { $set: { "metadata.category": "General" } }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Category deleted and files reassigned to 'General'",
//       filesUpdated: fileUpdateResult.modifiedCount,
//     });
//   } catch (error) {
//     console.error("Error deleting category:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
router.post("/deleteCategory/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { categoryToDelete } = req.body;

    if (!userId || !categoryToDelete) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const trimmedCategory = categoryToDelete.trim().toLowerCase();

    // Fetch user
    const user = await db.collection("userData").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Filter out the category (case-insensitive)
    const updatedCategories = (user.categories || []).filter(
      (cat) => cat.trim().toLowerCase() !== trimmedCategory
    );

    // Update the user's categories list
    await db.collection("userData").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { categories: updatedCategories } }
    );

    // Reassign any files in that category to "General"
    await db.collection("encryptedFiles.files").updateMany(
      { "metadata.userId": userId, "metadata.category": { $regex: `^${trimmedCategory}$`, $options: "i" } },
      { $set: { "metadata.category": "General" } }
    );

    res.status(200).json({
      success: true,
      message: "Category deleted and files reassigned to 'General'",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/deleteFile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { fileId } = req.body;

    if (!userId || !fileId) {
      return res.status(400).json({ error: "Missing userId or fileId parameter." });
    }

    // Ensure the fileId is a valid ObjectId if applicable
    const fileQuery = ObjectId.isValid(fileId)
      ? { _id: new ObjectId(fileId), "metadata.userId": userId }
      : { filename: fileId, "metadata.userId": userId };

    // Find the file to get its _id (needed for chunk deletion)
    const file = await db.collection("encryptedFiles.files").findOne(fileQuery);

    if (!file) {
      return res.status(404).json({ error: "File not found or not owned by the user." });
    }

    // Delete the file from the files collection
    const fileDeleteResult = await db.collection("encryptedFiles.files").deleteOne({ _id: file._id });

    if (fileDeleteResult.deletedCount === 0) {
      return res.status(404).json({ error: "File not found or could not be deleted." });
    }

    // Delete associated chunks from the chunks collection
    const chunksDeleteResult = await db.collection("encryptedFiles.chunks").deleteMany({ files_id: file._id });

    // Decrement the file count for the user
    await db.collection("userData").updateOne(
      { _id: new ObjectId(userId) }, // Find the user by userId
      { $inc: { fileCount: -1 } } // Decrement the fileCount field by 1
    );

    res.status(200).json({
      success: true,
      message: "File and associated chunks deleted successfully.",
      deletedChunks: chunksDeleteResult.deletedCount, // Optional: Number of chunks deleted
    });
  } catch (error) {
    console.error("Error deleting file:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});


router.get("/getCategoriesFileCount/:userId", async (req, res) => {
  try {
    // Get userId from request params
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ error: "Missing parameter: userId" });
    }

    // Query the user from the database
    const user = await db
      .collection("userData")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Ensure categories is an array (use original names from the database)
    const categories = user.categories || [];
    

    // Normalize category names for matching
    const normalizedCategories = categories.map((cat) => ({
      original: cat, // Store the original name
      normalized: cat.trim().toLowerCase(), // Normalized version
    }));

    // Calculate file counts for each category
    const fileCounts = await db
      .collection("encryptedFiles.files")
      .aggregate([
        { $match: { "metadata.userId": userId.toString() } },
        {
          $group: {
            _id: { $toLower: { $trim: { input: "$metadata.category" } } },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    

    // Map the counts to their respective categories
    const categoriesWithCounts = normalizedCategories.map((category) => {
      const fileCount =
        fileCounts.find((file) => file._id === category.normalized)?.count || 0;
      return { category: category.original, fileCount };
    });

    

    // Return the categories with file counts
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories: categoriesWithCounts,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Endpoint to fetch all filenames for a specific user
 */

router.get('/getFiles/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Missing parameter: userId" });
    }

    // Query to get all filenames for the user
    const files = await db.collection('encryptedFiles.files')
      .find({ "metadata.userId": userId })
      .project({ filename: 1, _id: 0 }) // Only return filenames
      .toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: "No files found for this user." });
    }

    const fileNames = files.map(file => file.filename);

    res.status(200).json({ success: true, files: fileNames });
  } catch (error) {
    console.error("Error fetching filenames:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Endpoint to handle file viewing requests -> dummy ...to be integrated
 */
router.post("/clickToView", async (req, res) => {
  try {
    const { filename } = req.body; // Extract the filename from the request body

    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    console.log(`File clicked for viewing: ${filename}`);

    // You can extend this logic to fetch file details or generate a file preview link
    const file = await db.collection("encryptedFiles.files").findOne({
      filename: filename,
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.status(200).json({
      success: true,
      message: `File "${filename}" ready for viewing.`,
      fileDetails: {
        filename: file.filename,
        uploadDate: file.uploadDate,
        contentType: file.metadata.contentType,
      },
    });
  } catch (error) {
    console.error("Error handling clickToView:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getFileId/:userId/:fileName", async (req, res) => {
  try {
    const { userId, fileName } = req.params;

    if (!userId || !fileName) {
      return res.status(400).json({ error: "Missing userId or fileName" });
    }

    // Query MongoDB to find file by filename
    const file = await db.collection("encryptedFiles.files").findOne({
      filename: fileName,
      "metadata.userId": userId,
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    
    res.status(200).json({ fileId: file._id.toString() }); // Send back the _id
  } catch (error) {
    console.error("Error fetching file ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// router.get("/check-active-session/:userId/:doctorEmail", async (req, res) => {
//   try {
//     const { userId, doctorEmail } = req.params;

//     if (!userId || !doctorEmail) {
//       return res.status(400).json({ error: "Missing userId or doctorEmail parameter." });
//     }

//     // Fetch the user's encrypted root key from the userData collection
//     const user = await db.collection("userData").findOne({ _id: new ObjectId(userId) });

//     if (!user || !user.userRootKey) {
//       return res.status(404).json({ error: "User or rootKey not found." });
//     }

//     // Convert the stored rootKey into a buffer
//     const rootKeyBuffer = Buffer.from(user.userRootKey.value());

//     // Decrypt the user's root key
//     const rootKey = await keyManagement.getRootKey(rootKeyBuffer);
//     const rootKeyString = rootKey.toString("utf-8");

//     // Encrypt the doctorEmail using the same key
//     const encryptedDoctorEmail = CryptoJS.AES.encrypt(doctorEmail, rootKeyString).toString();

//     // Check if an active session already exists with the same encrypted email
//     const activeSession = await db.collection("sessionData").findOne({
//       userId,
//       doctorEmail: encryptedDoctorEmail, // Compare with encrypted email
//       sessionState: "Active",
//     });

//     if (activeSession) {
//       return res.status(400).json({ error: "Session with same recipient is already active!" });
//     }

//     res.status(200).json({ success: true, message: "No active session found. Proceed." });
//   } catch (error) {
//     console.error("Error checking active session:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });



module.exports = router;
