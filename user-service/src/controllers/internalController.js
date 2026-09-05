const User = require("../models/User");
const Post = require("../models/Post");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("_id name email residency createdAt")
      .lean();

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Internal get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};


const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .select(
        "_id creatorId media caption category likesCount commentsCount viewsCount createdAt"
      )
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Internal get posts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

module.exports = {
  getUsers,
  getPosts,
};