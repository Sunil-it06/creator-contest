const express = require("express");

const adminAuthMiddleware =
  require("../middleware/adminAuthMiddleware");

const {
  generateWinners,
} = require("../controllers/prizeController");

const router = express.Router();

router.use(adminAuthMiddleware);

router.get("/generate", generateWinners);

module.exports = router;