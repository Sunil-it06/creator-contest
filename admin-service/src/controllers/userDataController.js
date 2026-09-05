const userServiceClient = require("../services/userServiceClient");

const getUsersFromUserService = async (req, res) => {
  try {
    const response = await userServiceClient.get(
      "/api/internal/users"
    );

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(
      "User Service request failed:",
      error.message
    );

    return res.status(502).json({
      success: false,
      message: "User Service unavailable",
    });
  }
};

const getPostsFromUserService = async (req, res) => {
  try {
    const response = await userServiceClient.get(
      "/api/internal/posts"
    );

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(
      "User Service request failed:",
      error.message
    );

    return res.status(502).json({
      success: false,
      message: "User Service unavailable",
    });
  }
};

module.exports = {
  getUsersFromUserService,
  getPostsFromUserService,
};