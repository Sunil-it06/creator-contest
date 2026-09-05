require("dotenv").config();

const express = require("express");
const cors = require("cors");

const testRoutes = require("./routes/testRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userDataRoutes = require("./routes/userDataRoutes");
const rankingRoutes = require("./routes/rankingRoutes");
const prizeRoutes = require("./routes/prizeRoutes");
const winnerRoutes = require("./routes/winnerRoutes");
const kycRoutes = require("./routes/kycRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    service: "admin-service",
    status: "running",
  });
});

// Test
app.use("/api/test", testRoutes);

// Admin authentication
app.use("/api/admin/auth", adminAuthRoutes);

// Admin profile
app.use("/api/admin", adminRoutes);

// User Service data
app.use("/api/admin/data", userDataRoutes);

// Rankings
app.use("/api/admin/rankings", rankingRoutes);

// Prizes
app.use("/api/admin/prizes", prizeRoutes);

// Winners
app.use("/api/admin/winners", winnerRoutes);

// KYC
app.use("/api/admin", kycRoutes);

// Server
const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`Admin Service running on port ${PORT}`);
});