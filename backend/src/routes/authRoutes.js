const express = require("express");
const { ObjectId , MongoClient} = require("mongodb");
const CryptoJS = require ("crypto-js");
const keyManagement = require("../services/keyManagement");
const bcrypt = require("bcryptjs");
const { sendVerificationEmail,sendFilesEmail, sendVerificationEmailPasswordReset } = require("../services/emailService");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
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
    console.log("MongoDB connected successfully in authRoutes.js");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

initializeMongoDB().catch(console.error);

/**
 * Endpoint to send a verification email.
 * @route POST /send-verification
 */


router.post("/send-verification/:userId", async (req, res) => {
  // Extract userId from params object
  const userId = req.params.userId;
  
  // Get email from request body
  const { email } = req.body;

  // Validate required fields
  if (!userId || !email) {
      return res.status(400).json({ error: "User ID and email are required" });
  }

  try {
      const userSessionCollection = db.collection("userSessionData");
      
      // Find the user session
      let userSession = await userSessionCollection.findOne({ userId });

      // Check if email already exists in the array
      const emailExists = userSession?.emails.some((e) => e.email === email);
      
      if (!emailExists) {
          return res.status(404).json({ error: "Email not found in user session" });
      }

      // Update the status of the matching email to "pending"
      await userSessionCollection.updateOne(
          { userId, "emails.email": email },
          { $set: { "emails.$.status": "pending" } }
      );

      // Send verification email
      await sendVerificationEmail(email);

      res.json({ message: "Verification email sent successfully" });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});
/**
 * Endpoint to verify the email.
 * @route GET /verify-email
 */

router.post("/send-verification-forgot-password/:username", async (req, res) => {
  const { username } = req.params;
  const { email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: "Username and email are required" });
  }

  try {
    const user = await db.collection("userData").findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.email !== email) {
      return res.status(404).json({ error: "Email does not match registered user" });
    }

    // Update verification status or generate token
    // await db.collection("userData").updateOne(
    //   { _id: user._id },
    //   { $set: { verificationStatus: "pending" } }
    // );

    await sendVerificationEmailPasswordReset(email);
    res.json({ message: "Verification email sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const userSessionCollection = db.collection("userSessionData");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Find the user session that contains this email
    const userSession = await userSessionCollection.findOne({ "emails.email": email });

    if (!userSession) {
      return res.status(404).json({ error: "Email not found" });
    }

    // Update the email status in the array
    await userSessionCollection.updateOne(
      { "emails.email": email },
      { $set: { "emails.$.status": "verified" } }
    );

    // Retrieve the updated user session
    const updatedUserSession = await userSessionCollection.findOne({ userId: userSession.userId });

    res.json({ message: "Email verified successfully", userSession: updatedUserSession });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

// API to send secure files link to the doctor
router.post('/send-files-mail', async (req, res) => {
  const { doctorEmail, sessionId } = req.body;

  if (!doctorEmail || !sessionId) {
      return res.status(400).json({ message: 'Doctor email and sessionId are required' });
  }

  try {
      await sendFilesEmail(doctorEmail, sessionId);
      res.status(200).json({ message: 'Secure link sent successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error sending email' });
  }
});

// API to validate session and activate it
router.get('/validate-session/:sessionId', async (req, res) => {
  try {
      const { sessionId } = req.params;
      const token = req.query.token;
      const sessionOwnerId = req.headers["x-session-owner"]; // Extract sessionOwnerId from headers

      if (!token) {
        await db.collection("sessionData").updateOne(
          { sessionId },
          { $set: { sessionState: "Inactive" } }
      );
          return res.status(403).json({ message: "Access Denied: No token provided." });
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.sessionId !== sessionId) {
          return res.status(403).json({ message: "Access Denied: Invalid session." });
      }

      // Fetch session from database
      const sessionItem = await db.collection("sessionData").findOne({ sessionId });

      if (!sessionItem) {
          return res.status(404).json({ message: "Access Denied: Session not found." });
      }

      if(sessionItem.status=="Inactive"){
        return res.status(404).json({message: "Access Denied: Session inactive!"});
      }

      // ✅ If first-time access, assign a sessionOwnerId and lock the session
      if (!sessionItem.sessionOwnerId) {
          const newSessionOwnerId = uuidv4();
          await db.collection("sessionData").updateOne(
              { sessionId },
              { $set: { sessionState: "Active", sessionOwnerId: newSessionOwnerId } }
          );
          return res.json({ message: "Session Valid", sessionOwnerId: newSessionOwnerId, files: sessionItem.files });
      }

      // ✅ If user reloads, allow access if sessionOwnerId matches
      if (sessionItem.sessionOwnerId === sessionOwnerId) {
          return res.json({ message: "Session Valid", files: sessionItem.files });
      }

      // ❌ If another person tries to access, deny access
      return res.status(403).json({ message: "Access Denied: This session is already in use." });

  } catch (error) {
      console.error("Error in validate-session:", error.message);
      return res.status(403).json({ message: "Invalid or expired token." });
  }
});

router.get("/fetch-emails/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the userSessionData entry for the given userId
    const sessionData = await db.collection("userSessionData").findOne({ userId });

    if (!sessionData) {
      return res.status(404).json({ error: "User session data not found" });
    }

    // Return the emails array
    res.status(200).json({ emails: sessionData.emails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add email to userSessionData
router.post("/enter-email/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if the user exists in userSessionData
    const userSession = await db.collection("userSessionData").findOne({ userId });

    if (!userSession) {
      return res.status(404).json({ error: "User session data not found" });
    }

    // Check if email already exists in the array
    const emailExists = userSession.emails.some((entry) => entry.email === email);

    if (emailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Add the new email with default status "unverified"
    await db.collection("userSessionData").updateOne(
      { userId },
      { $push: { emails: { email, status: "unverified" } } }
    );

    res.status(201).json({ message: "Email added successfully", email, status: "unverified" });
  } catch (error) {
    console.error("Error adding email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete-email/:userId", async (req, res) => {
  try {
      const { userId } = req.params;
      const { email } = req.body; // Get email from request body

      if (!email) {
          return res.status(400).json({ error: "Email is required for deletion." });
      }

      // Check if user session data exists
      const userSession = await db.collection("userSessionData").findOne({ userId });

      if (!userSession) {
          return res.status(404).json({ error: "User session data not found." });
      }

      // Check if email exists in the array
      const emailExists = userSession.emails.some(entry => entry.email === email);

      if (!emailExists) {
          return res.status(400).json({ error: "Email not found in user session data." });
      }

      // Remove the email from the emails array
      await db.collection("userSessionData").updateOne(
          { userId },
          { $pull: { emails: { email: email } } }
      );

      res.status(200).json({ message: "Email deleted successfully." });
  } catch (error) {
      console.error("Error deleting email:", error);
      res.status(500).json({ error: "Internal server error." });
  }
});

//gets files for that active session based on match of doctor name and user id
router.get("/getSessionFiles/:userId/:doctorName", async (req, res) => {
  try {
    const { userId} = req.params;
    const doctorName = decodeURIComponent(req.params.doctorName); // Decode doctor name

    //console.log("Received Doctor Name:", doctorName); // Debugging
    
    // Find the session data that matches the userId and doctorName
    const session = await db.collection("sessionData").findOne({ userId, doctorName });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    
    if (session.sessionState !== "Active") {
      return res.status(403).json({ message: "Session is inactive" });
    }
    
    // Extract file IDs from the session
    const fileIds = session.files.map(id => new ObjectId(id));

    // Fetch file details using native MongoDB query
    const files = await db.collection("encryptedFiles.files").find({ _id: { $in: fileIds } }).toArray();

    return res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching session files:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.delete("/deleteFileFromSession/:userId/:doctorName", async (req, res) => {
  try {
    const { userId } = req.params;
    const doctorName = decodeURIComponent(req.params.doctorName);
    const { fileName } = req.body; // File name sent in request body

    if (!userId || !doctorName || !fileName) {
      return res.status(400).json({ error: "Missing userId, doctorName, or fileName parameter." });
    }

    console.log(`Attempting to delete ${fileName} for session: User ${userId}, Doctor ${doctorName}`);

    // Step 1: Fetch File ID using existing getFileId route
    const fileIdResponse = await axios.get(`http://localhost:3001/getFileId/${userId}/${fileName}`);

    if (fileIdResponse.status !== 200 || !fileIdResponse.data.fileId) {
      return res.status(404).json({ error: "File ID not found." });
    }

    const fileId = fileIdResponse.data.fileId;

    // Step 2: Find the session for the given userId and doctorName
    const session = await db.collection("sessionData").findOne({ userId, doctorName });

    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    // Step 3: Check if the file exists in the session
    if (!session.files.includes(fileId)) {
      return res.status(404).json({ error: "File not found in this session." });
    }

    // Step 4: Remove the file ID from the session's files array
    const updatedFiles = session.files.filter((id) => id !== fileId);

    // Step 5: Update the session in the database
    await db.collection("sessionData").updateOne(
      { userId, doctorName },
      { $set: { files: updatedFiles } }
    );

    return res.status(200).json({
      success: true,
      message: `File "${fileName}" successfully removed from the session.`,
    });
  } catch (error) {
    console.error("Error removing file from session:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/addFilesToSession/:userId/:doctorName", async (req, res) => {
  try {
    const { userId } = req.params;
    const doctorName = decodeURIComponent(req.params.doctorName);
    const { selectedFiles } = req.body; // Expecting an array of filenames

    if (!userId || !doctorName || !Array.isArray(selectedFiles) || selectedFiles.length === 0) {
      return res.status(400).json({ error: "Invalid request parameters." });
    }

    // Step 1: Fetch session details
    const session = await db.collection("sessionData").findOne({ userId, doctorName });

    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    // Step 2: Fetch File IDs using their filenames
    const fileObjects = await db.collection("encryptedFiles.files")
      .find({ filename: { $in: selectedFiles }, "metadata.userId": userId })
      .project({ _id: 1 })
      .toArray();

    const fileIdsToAdd = fileObjects.map(file => file._id.toString());

    // Step 3: Update the session's files array
    const updatedFiles = [...new Set([...session.files, ...fileIdsToAdd])]; // Ensure no duplicates

    await db.collection("sessionData").updateOne(
      { userId, doctorName },
      { $set: { files: updatedFiles } }
    );

    return res.status(200).json({
      success: true,
      message: "Files successfully added to the session.",
      addedFiles: fileIdsToAdd
    });

  } catch (error) {
    console.error("Error adding files to session:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//gets all active sessions and returns the doctors' names to be displayed on active chats page

router.get("/getActiveSessions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Fetch active chat sessions for the user
    const sessions = await db.collection("sessionData")
      .find({ userId, sessionState: "Active" }) // Only fetch active sessions
      .project({ doctorName: 1, _id: 0 }) // Return only doctor names
      .toArray();

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ error: "No active sessions found." });
    }

    res.status(200).json({ success: true, sessions });
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get doctor name and user ID based on sessionId
router.get("/getSessionDetails/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required." });
    }

    // Find session by sessionId
    const session = await db.collection("sessionData").findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    // Extract userId and doctorName
    const { userId, doctorName } = session;

    return res.status(200).json({ success: true, userId, doctorName });
  } catch (error) {
    console.error("Error fetching session details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/terminateSession/:userId/:doctorName", async (req, res) => {
  try {
    const { userId } = req.params;
    const doctorName = decodeURIComponent(req.params.doctorName); // Decode doctor name

    // Find the session that matches userId and doctorName
    const session = await db.collection("sessionData").findOne({ userId, doctorName });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Update sessionState to "Inactive"
    const result = await db.collection("sessionData").updateOne(
      { userId, doctorName },
      { $set: { sessionState: "Inactive" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to update session state" });
    }

    return res.status(200).json({ success: true, message: "Session terminated successfully" });
  } catch (error) {
    console.error("Error terminating session:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router;

