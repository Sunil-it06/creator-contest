const { prisma } = require("../config/prisma");

const saveGeneratedWinners = async (winners) => {
  const savedWinners = [];

  for (const winner of winners) {
    const slotKey = buildSlotKey(winner);

    const existingWinner = await prisma.winner.findFirst({
      where: {
        slotKey,
        status: "ACTIVE",
      },
    });

    if (existingWinner) {
      savedWinners.push(existingWinner);
      continue;
    }

    const createdWinner = await prisma.winner.create({
      data: {
        userId: String(winner.creatorId),
        slotKey,
        prizeTier: winner.prizeTier,
        prizeName: winner.prizeName,
        status: "ACTIVE",
        kycStatus: "NOT_REQUESTED",
      },
    });

    savedWinners.push(createdWinner);
  }

  return savedWinners;
};

const buildSlotKey = (winner) => {
  if (winner.prizeTier === "GRAND_PRIZE") {
    return "GRAND_PRIZE";
  }

  if (winner.prizeTier === "CONSISTENCY") {
    return `CONSISTENCY_${winner.rank}`;
  }

  if (winner.prizeTier === "TOP_PERFORMER") {
    return `TOP_PERFORMER_${winner.rank}`;
  }

  if (winner.prizeTier === "CATEGORY_FIRST") {
    return `CATEGORY_FIRST_${winner.category}`;
  }

  if (winner.prizeTier === "CATEGORY_SECOND") {
    return `CATEGORY_SECOND_${winner.category}`;
  }

  throw new Error(`Unknown prize tier: ${winner.prizeTier}`);
};

module.exports = {
  saveGeneratedWinners,
  buildSlotKey,
};
