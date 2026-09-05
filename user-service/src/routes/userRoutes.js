const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
    getMe,
    updateProfile
} = require("../controllers/userController");

const router = express.Router();

router.get(
    "/me",
    authMiddleware,
    getMe
);

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);

module.exports = router;