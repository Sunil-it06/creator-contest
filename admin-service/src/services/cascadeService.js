const {
  buildGlobalRanking,
  buildCategoryRanking,
  buildConsistencyRanking,
} = require("./rankingService");

const {
  getRankingData,
} = require("./rankingDataService");

const {
  allocatePrizes,
} = require("./prizeService");

const {
  buildSlotKey,
} = require("./winnerService");


const cascadeFailedWinner = async ({
  failedWinner,
  excludedCreators,
}) => {

  const { posts } =
    await getRankingData();

  const globalRanking =
    buildGlobalRanking(posts);

  const categoryRanking =
    buildCategoryRanking(posts);

  const contestStartDate =
    process.env.CONTEST_START_DATE;

  const consistencyRanking =
    buildConsistencyRanking(
      posts,
      contestStartDate
    );


  const potentialWinners =
    allocatePrizes({
      globalRanking,
      categoryRanking,
      consistencyRanking,
      excludedCreators,
    });


  /*
   * Find replacement for exactly
   * the failed winner's slot.
   */
  const replacement =
    potentialWinners.find((winner) => {
      return (
        buildSlotKey(winner) ===
        failedWinner.slotKey
      );
    });


  return replacement || null;
};


module.exports = {
  cascadeFailedWinner,
};