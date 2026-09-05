const express = require("express");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const {
  getGlobalRanking,
  getCategoryRanking,
  getConsistencyRanking,
} = require("../controllers/rankingController");

const router = express.Router();

// All ranking APIs require admin login
router.use(adminAuthMiddleware);

router.get("/global", getGlobalRanking);

router.get("/category", getCategoryRanking);

router.get("/consistency", getConsistencyRanking);

module.exports = router;