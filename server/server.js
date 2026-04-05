require("dotenv").config();
require('./jobs/periodReminder');

const initCronJobs = require('./utils/cronJobs');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
require("./config/passport");

// Import routes
const chatRoute = require("./routes/chatRoute");
const authRoute = require("./routes/auth");
const cyclesRoute = require("./routes/cycles");
const dailyLogsRoute = require("./routes/dailyLogs");
const trackerRoutes = require('./routes/tracker');
const adminRoutes = require('./routes/admin');   // ✅ Import admin routes

const app = express();   // ✅ app is created HERE
initCronJobs();

// Middleware
app.use(cors({
  origin: ["https://thecyclecare.vercel.app","http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// Register routes AFTER app is created
app.use('/api/tracker', trackerRoutes);
app.use("/api/chat", chatRoute);
app.use("/api/auth", authRoute);
app.use("/api/cycles", cyclesRoute);
app.use("/api/daily-logs", dailyLogsRoute);
app.use('/api/admin', adminRoutes);   // ✅ Move admin routes HERE (after app)

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "CycleCare API is running! 🚀",
    endpoints: {
      auth: "/api/auth",
      cycles: "/api/cycles",
      dailyLogs: "/api/daily-logs",
      chat: "/api/chat",
      tracker: "/api/tracker",
      admin: "/api/admin"
    }
  });
});

// MongoDB Connection
const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.CHATBOT_URI;

mongoose
  .connect(dbURI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Chatbot endpoint: https://cyclecare-j2yz.onrender.com/api/chat`);
  console.log(`🔐 Auth endpoint: https://cyclecare-j2yz.onrender.com/api/auth`);
  console.log(`📊 Tracker endpoint: https://cyclecare-j2yz.onrender.com/api/tracker`);
  console.log(`📅 Period reminder cron job initialized`);
});