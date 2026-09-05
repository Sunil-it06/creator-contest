const express = require("express");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get("/me", adminAuthMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected admin route working",
    adminId: req.admin.adminId,
  });
});

module.exports = router;