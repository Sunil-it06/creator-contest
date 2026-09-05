const express = require("express");

const {
  getUsers,
  getPosts,
} = require("../controllers/internalController");

const internalAuthMiddleware = require("../middleware/internalAuthMiddleware");

const router = express.Router();

router.use(internalAuthMiddleware);

router.get("/users", getUsers);
router.get("/posts", getPosts);

module.exports = router;