const express = require("express");
const { ObjectId, MongoClient } = require("mongodb");
const router = express.Router();

let db;

// Initialize MongoDB
async function initializeMongoDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set in environment variables");
    }
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db("medibase");
    console.log("MongoDB initialized for addNewFiles.js");
  } catch (error) {
    console.error("MongoDB initialization error:", error);
    throw error;
  }
}

initializeMongoDB().catch(console.error);

// Fetch categories for a user
router.get("/getCategories2/:userId", async (req, res) => {
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

    // Ensure categories is an array (handle missing categories field)
    const categories = user.categories || [];

    // Return the categories
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add new category for a user
router.post("/addNewCategory2/:userId", async (req, res) => {
    try {
      // Get userId from request params
      const { userId } = req.params;
      const { newCategory } = req.body; // Extract newCategory from request body
  
      // Validate userId and newCategory
      if (!userId) {
        return res.status(400).json({ error: "Missing parameter: userId" });
      }
      if (!newCategory || typeof newCategory !== "string") {
        return res.status(400).json({ error: "Invalid or missing category name" });
      }
  
      // Query the user from the database
      const user = await db
        .collection("userData")
        .findOne({ _id: new ObjectId(userId) });
  
      if (!user) {
        return res.status(404).json({ error: "User not found!" });
      }
  
      // Check if the category already exists (case-insensitive)
      const existingCategories = user.categories || [];
      const categoryExists = existingCategories.some(
        (category) => category.toLowerCase() === newCategory.toLowerCase()
      );
  
      if (categoryExists) {
        return res.status(400).json({ error: "Category already exists" });
      }
  
      // Add the new category
      await db.collection("userData").updateOne(
        { _id: new ObjectId(userId) },
        { $push: { categories: newCategory } }
      );
  
      // Respond with success
      return res.status(201).json({
        success: true,
        message: "Category added successfully",
        newCategory,
      });
    } catch (error) {
      console.error("Error adding new category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

// Fetch all the files for that particular userId
router.get("/files2/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ error: "Missing parameter: userId" });
    }

    // Query the user from the database
    const user = await db.collection("userData").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Fetch all files for the given userId
    const files = await db
      .collection("encryptedFiles.files")
      .find({ "metadata.userId": userId.toString()},{ projection: { filename: 1, _id: 0 }})
      .toArray();

    if (files.length === 0) {
      console.log(`No files found for user: ${userId}`);
      return res.status(200).json({ message: "No files found.", files: [] });
    }

    console.log(`Found ${files.length} file(s) for user: ${userId}`);

    // Respond with the list of files
    res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

module.exports = router;
