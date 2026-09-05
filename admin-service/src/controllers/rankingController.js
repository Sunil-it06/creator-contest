const {
  buildGlobalRanking,
  buildCategoryRanking,
  buildConsistencyRanking,
} = require("../services/rankingService");

const {
  getRankingData,
} = require("../services/rankingDataService");

const getGlobalRanking = async (req, res) => {
  try {
    const { posts } = await getRankingData();

    const ranking = buildGlobalRanking(posts);

    return res.status(200).json({
      success: true,
      ranking,
    });
  } catch (error) {
    console.error("Global ranking error:", error.message);

    return res.status(502).json({
      success: false,
      message: "Failed to generate global ranking",
    });
  }
};

const getCategoryRanking = async (req, res) => {
  try {
    const { posts } = await getRankingData();

    const ranking = buildCategoryRanking(posts);

    return res.status(200).json({
      success: true,
      ranking,
    });
  } catch (error) {
    console.error("Category ranking error:", error.message);

    return res.status(502).json({
      success: false,
      message: "Failed to generate category ranking",
    });
  }
};

const getConsistencyRanking = async (req, res) => {
  try {
    const { posts } = await getRankingData();

    const contestStartDate = process.env.CONTEST_START_DATE;

    if (!contestStartDate) {
      return res.status(500).json({
        success: false,
        message: "Contest start date is not configured",
      });
    }

    const ranking = buildConsistencyRanking(
      posts,
      contestStartDate
    );

    return res.status(200).json({
      success: true,
      contestStartDate,
      ranking,
    });
  } catch (error) {
    console.error("Consistency ranking error:", error.message);

    return res.status(502).json({
      success: false,
      message: "Failed to generate consistency ranking",
    });
  }
};

module.exports = {
  getGlobalRanking,
  getCategoryRanking,
  getConsistencyRanking,
};