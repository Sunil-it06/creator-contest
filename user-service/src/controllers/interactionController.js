const mongoose = require("mongoose");

const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");


const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    try {
      await Like.create({
        postId: id,
        userId,
      });
    } catch (error) {
      // Duplicate like
      if (error.code === 11000) {
        return res.status(409).json({
          message: "You already liked this post",
        });
      }

      throw error;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        $inc: {
          likesCount: 1,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: "Post liked successfully",
      likesCount: updatedPost.likesCount,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to like post",
    });
  }
};


const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    if (text.trim().length > 500) {
      return res.status(400).json({
        message: "Comment cannot exceed 500 characters",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      postId: id,
      userId,
      text: text.trim(),
    });

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        $inc: {
          commentsCount: 1,
        },
      },
      {
        new: true,
      }
    );

    return res.status(201).json({
      message: "Comment added successfully",

      comment: {
        id: comment._id,
        text: comment.text,
        userId: comment.userId,
        createdAt: comment.createdAt,
      },

      commentsCount: updatedPost.commentsCount,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to add comment",
    });
  }
};

const viewPost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        $inc: {
          viewsCount: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      message: "View counted",
      viewsCount: updatedPost.viewsCount,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to count view",
    });
  }
};

module.exports = {
  likePost,
  addComment,
  viewPost,
};