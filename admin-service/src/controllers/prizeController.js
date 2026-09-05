const {
  buildGlobalRanking,
  buildCategoryRanking,
  buildConsistencyRanking,
  filterEligiblePosts,
} = require("../services/rankingService");

const {
  getRankingData,
} = require("../services/rankingDataService");

const {
  allocatePrizes,
} = require("../services/prizeService");


const generateWinners = async (req, res) => {
  try {
    const {
      posts,
    } = await getRankingData();

    /*
     * Generate all rankings
     */

    const globalRanking =
      buildGlobalRanking(posts);

    const categoryRanking =
      buildCategoryRanking(posts);

    const contestStartDate =
      process.env.CONTEST_START_DATE;

    if (!contestStartDate) {
      return res.status(500).json({
        success: false,
        message: "Contest start date is not configured",
      });
    }

    const consistencyRanking =
      buildConsistencyRanking(
        posts,
        contestStartDate
      );


    /*
     * Allocate prizes
     */

    const winners = allocatePrizes({
      globalRanking,
      categoryRanking,
      consistencyRanking,
    });


    return res.status(200).json({
      success: true,

      count: winners.length,

      winners,
    });

  } catch (error) {

    console.error(
      "Winner generation error:",
      error.message
    );

    return res.status(502).json({
      success: false,
      message: "Failed to generate winners",
    });
  }
};


module.exports = {
  generateWinners,
};