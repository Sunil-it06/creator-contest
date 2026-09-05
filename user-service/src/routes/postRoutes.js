const express = require("express");

const {
  createPost,
  getPosts,
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getPosts
);

router.post(
  "/",
  authMiddleware,
  upload.single("media"),
  createPost
);

module.exports = router;