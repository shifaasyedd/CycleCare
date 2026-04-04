const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ["https://thecyclecare.vercel.app", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
  });

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'CycleCare API is running! 🚀',
    database: 'Connected to MongoDB Atlas'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});