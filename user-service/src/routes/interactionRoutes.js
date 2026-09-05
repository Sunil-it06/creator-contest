const express = require("express");

const {
  likePost,
  addComment,
  viewPost,
} = require("../controllers/interactionController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/:id/like",
  authMiddleware,
  likePost
);

router.post(
  "/:id/comment",
  authMiddleware,
  addComment
);

router.post(
  "/:id/view",
  authMiddleware,
  viewPost
);

module.exports = router;