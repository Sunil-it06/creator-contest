const Post = require("../models/Post");
const User = require("../models/User");

const {
    POST_CATEGORIES
} = require("../constants/categories");

const createPost = async (req, res) => {
    try {
        const { caption, category } = req.body;

        // 1. Validate caption
        if (!caption || !caption.trim()) {
            return res.status(400).json({
                success: false,
                message: "Caption is required"
            });
        }

        // 2. Validate category
        if (!POST_CATEGORIES.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });
        }

        // 3. Validate file
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Media file is required"
            });
        }

        // 4. Verify user exists
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 5. Determine media type
        const mediaType = req.file.mimetype.startsWith("image/")
            ? "image"
            : "video";

        // 6. Create post
        const post = await Post.create({
            creatorId: user._id,

            media: {
                type: mediaType,
                path: req.file.path
            },

            caption: caption.trim(),

            category,

            likesCount: 0,
            commentsCount: 0,
            viewsCount: 0
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        });

    } catch (error) {
        console.error("Create post error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("creatorId", "name email")
      .sort({
        createdAt: -1,
      })
      .limit(20);

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch posts",
    });
  }
};



module.exports = {
    createPost,
    getPosts,
};