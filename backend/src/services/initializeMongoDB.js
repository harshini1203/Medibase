const { MongoClient } = require("mongodb");

let db;

async function initializeMongoDB() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db("medibase");
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Export function and DB instance
module.exports = { initializeMongoDB, db };

