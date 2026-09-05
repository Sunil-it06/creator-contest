const express = require("express");

const adminAuthMiddleware =
  require("../middleware/adminAuthMiddleware");

const {
  generateAndSaveWinners,
  getWinners,
} = require("../controllers/winnerController");

const router = express.Router();

router.use(adminAuthMiddleware);

router.get(
  "/generate",
  generateAndSaveWinners
);

router.get(
  "/",
  getWinners
);

module.exports = router;