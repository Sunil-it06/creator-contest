const { prisma } = require("../config/prisma");

const {
  buildGlobalRanking,
  buildCategoryRanking,
  buildConsistencyRanking,
} = require("../services/rankingService");

const {
  getRankingData,
} = require("../services/rankingDataService");

const {
  allocatePrizes,
} = require("../services/prizeService");

const {
  saveGeneratedWinners,
} = require("../services/winnerService");


/*
 * Generate and persist winners
 */
const generateAndSaveWinners = async (req, res) => {
  try {
    const { posts } = await getRankingData();

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

    const winners = allocatePrizes({
      globalRanking,
      categoryRanking,
      consistencyRanking,
    });

    const savedWinners =
      await saveGeneratedWinners(winners);

    return res.status(200).json({
      success: true,
      count: savedWinners.length,
      winners: savedWinners,
    });

  } catch (error) {
    console.error(
      "Generate winners error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate winners",
    });
  }
};


/*
 * Get all winners
 */
const getWinners = async (req, res) => {
  try {
    const winners = await prisma.winner.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: winners.length,
      winners,
    });

  } catch (error) {
    console.error(
      "Get winners error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch winners",
    });
  }
};


module.exports = {
  generateAndSaveWinners,
  getWinners,
};