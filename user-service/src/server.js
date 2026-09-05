const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const internalRoutes = require("./routes/internalRoutes");
const path = require("path");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


connectDB();

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "User service is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts", interactionRoutes);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);
app.use("/api/internal", internalRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});