const express = require("express");
const prisma = require("../config/prisma");

const router = express.Router();

router.get("/db", async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();

    res.json({
      success: true,
      message: "PostgreSQL connected successfully",
      admins,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

module.exports = router;