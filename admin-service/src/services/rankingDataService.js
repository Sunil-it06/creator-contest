const userServiceClient = require("./userServiceClient");

const {
  filterEligiblePosts,
} = require("./rankingService");

const getRankingData = async () => {
  try {
    // Fetch users and posts in parallel
    const [usersResponse, postsResponse] = await Promise.all([
      userServiceClient.get("/api/internal/users"),
      userServiceClient.get("/api/internal/posts"),
    ]);

    const users = usersResponse.data.users || [];
    const posts = postsResponse.data.posts || [];

    // Only posts created by eligible Chhattisgarh residents
    const eligiblePosts = filterEligiblePosts(posts, users);

    return {
      users,
      posts: eligiblePosts,
    };
  } catch (error) {
    console.error(
      "Failed to fetch ranking data:",
      error.response?.data || error.message
    );

    throw error;
  }
};

module.exports = {
  getRankingData,
};