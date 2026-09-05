const express = require("express");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const {
  getUsersFromUserService,
  getPostsFromUserService,
} = require("../controllers/userDataController");

const router = express.Router();

router.use(adminAuthMiddleware);

router.get("/users", getUsersFromUserService);
router.get("/posts", getPostsFromUserService);

module.exports = router;