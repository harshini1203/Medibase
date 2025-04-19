require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fileRoutes = require('./routes/fileRoutes');
const addNewFilesRoutes = require("./routes/addNewFiles");
const viewFilesRoutes=require('./routes/viewFilesRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const cors = require("cors");

const app = express();

// ✅ Apply middleware correctly on `app`
app.use(cors({ 
    origin: "http://localhost:3000", 
    credentials: true 
}));
app.use(express.json());

// MongoDB Connection with proper error handling
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

connectDB();

app.use('/', fileRoutes);
app.use('/', addNewFilesRoutes);
app.use('/',viewFilesRoutes);
app.use('/',authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));