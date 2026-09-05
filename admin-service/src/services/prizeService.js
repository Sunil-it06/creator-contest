const allocateCategoryPrizes = ({
  categoryRanking,
  usedCreators,
  winners,
  prizeTier,
  prizeLabel,
}) => {
  const categories = {};

  // Group posts by category
  for (const item of categoryRanking) {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }

    categories[item.category].push(item);
  }

  // Process each category independently
  for (const category of Object.keys(categories).sort()) {
    const categoryItems = categories[category];

    // Find first creator who has not already won
    const winner = categoryItems.find(
      (item) => !usedCreators.has(String(item.creatorId))
    );

    if (!winner) {
      // Category exhausted.
      // Do not backfill from another category.
      continue;
    }

    const creatorId = String(winner.creatorId);

    usedCreators.add(creatorId);

    winners.push({
      creatorId,
      postId: winner.postId,
      category: winner.category,
      prizeTier,
      prizeName: `${category} ${prizeLabel}`,
      rank: winner.rank,
    });
  }
};


const allocatePrizes = ({
  globalRanking,
  consistencyRanking,
  categoryRanking,
}) => {
  const winners = [];

  // Track creators who already won
  const usedCreators = new Set();

  /*
   * ==================================================
   * 1. GRAND PRIZE
   * ==================================================
   */

  const grandPrize = globalRanking[0];

  if (grandPrize) {
    usedCreators.add(String(grandPrize.creatorId));

    winners.push({
      creatorId: String(grandPrize.creatorId),
      postId: grandPrize.postId,
      category: grandPrize.category,
      prizeTier: "GRAND_PRIZE",
      prizeName: "Grand Prize",
      rank: grandPrize.rank,
    });
  }


  /*
   * ==================================================
   * 2. CONSISTENCY 1ST
   * ==================================================
   */

  const consistencyFirst = consistencyRanking.find(
    (item) =>
      !usedCreators.has(String(item.creatorId))
  );

  if (consistencyFirst) {
    usedCreators.add(String(consistencyFirst.creatorId));

    winners.push({
      creatorId: String(consistencyFirst.creatorId),
      postId: null,
      category: null,
      prizeTier: "CONSISTENCY",
      prizeName: "Consistency 1st",
      rank: 1,
    });
  }


  /*
   * ==================================================
   * 3. CONSISTENCY 2ND
   * ==================================================
   */

  const consistencySecond = consistencyRanking.find(
    (item) =>
      !usedCreators.has(String(item.creatorId))
  );

  if (consistencySecond) {
    usedCreators.add(String(consistencySecond.creatorId));

    winners.push({
      creatorId: String(consistencySecond.creatorId),
      postId: null,
      category: null,
      prizeTier: "CONSISTENCY",
      prizeName: "Consistency 2nd",
      rank: 2,
    });
  }


  /*
   * ==================================================
   * 4. TOP PERFORMERS
   * ==================================================
   */

  let topPerformerCount = 0;

  for (const item of globalRanking) {
    if (topPerformerCount >= 10) {
      break;
    }

    const creatorId = String(item.creatorId);

    if (usedCreators.has(creatorId)) {
      continue;
    }

    usedCreators.add(creatorId);

    topPerformerCount++;

    winners.push({
      creatorId,
      postId: item.postId,
      category: item.category,
      prizeTier: "TOP_PERFORMER",
      prizeName: `Top Performer #${topPerformerCount}`,
      rank: item.rank,
    });
  }


  /*
   * ==================================================
   * 5. CATEGORY 1ST
   * ==================================================
   */

  allocateCategoryPrizes({
    categoryRanking,
    usedCreators,
    winners,
    prizeTier: "CATEGORY_FIRST",
    prizeLabel: "1st",
  });


  /*
   * ==================================================
   * 6. CATEGORY 2ND
   * ==================================================
   */

  allocateCategoryPrizes({
    categoryRanking,
    usedCreators,
    winners,
    prizeTier: "CATEGORY_SECOND",
    prizeLabel: "2nd",
  });


  return winners;
};


module.exports = {
  allocatePrizes,
};