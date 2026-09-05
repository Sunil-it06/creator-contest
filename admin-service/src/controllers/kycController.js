const { prisma } = require("../config/prisma");


const requestKyc = async (req, res) => {
  try {
    const { winnerId } = req.params;

    const winner = await prisma.winner.findUnique({
      where: {
        id: winnerId,
      },
    });

    if (!winner) {
      return res.status(404).json({
        success: false,
        message: "Winner not found",
      });
    }

    if (winner.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Winner is no longer active",
      });
    }

    if (winner.kycStatus === "PASSED") {
      return res.status(400).json({
        success: false,
        message: "KYC has already passed",
      });
    }

    const kycRequest =
      await prisma.kycRequest.create({
        data: {
          winnerId: winner.id,
          status: "PENDING",
        },
      });

    await prisma.winner.update({
      where: {
        id: winner.id,
      },
      data: {
        kycStatus: "PENDING",
      },
    });

    return res.status(201).json({
      success: true,
      message: "KYC request created",
      kycRequest,
    });

  } catch (error) {
    console.error(
      "KYC request error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create KYC request",
    });
  }
};

const markKycPassed = async (req, res) => {
  try {
    const { winnerId } = req.params;

    const winner = await prisma.winner.findUnique({
      where: {
        id: winnerId,
      },
    });

    if (!winner) {
      return res.status(404).json({
        success: false,
        message: "Winner not found",
      });
    }

    if (winner.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Winner is not active",
      });
    }

    await prisma.$transaction([
      prisma.winner.update({
        where: {
          id: winnerId,
        },
        data: {
          kycStatus: "PASSED",
        },
      }),

      prisma.kycRequest.updateMany({
        where: {
          winnerId,
          status: "PENDING",
        },
        data: {
          status: "PASSED",
          reviewedAt: new Date(),
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "KYC passed",
    });

  } catch (error) {
    console.error(
      "KYC pass error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to mark KYC as passed",
    });
  }
};

const {
  cascadeFailedWinner,
} = require("../services/cascadeService");


const markKycFailed = async (req, res) => {
  try {
    const { winnerId } = req.params;

    const winner =
      await prisma.winner.findUnique({
        where: {
          id: winnerId,
        },
      });

    if (!winner) {
      return res.status(404).json({
        success: false,
        message: "Winner not found",
      });
    }

    if (winner.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Winner is already removed",
      });
    }


    /*
     * Mark old winner as failed/removed.
     */
    const excludedCreators =
      new Set([winner.userId]);


    await prisma.$transaction([
      prisma.winner.update({
        where: {
          id: winnerId,
        },
        data: {
          status: "REMOVED",
          kycStatus: "FAILED",
        },
      }),

      prisma.kycRequest.updateMany({
        where: {
          winnerId,
          status: "PENDING",
        },
        data: {
          status: "FAILED",
          reviewedAt: new Date(),
          remarks:
            req.body?.remarks ||
            "KYC failed",
        },
      }),
    ]);


    /*
     * Find replacement.
     */
    const replacement =
      await cascadeFailedWinner({
        failedWinner: winner,
        excludedCreators,
      });


    /*
     * No eligible replacement.
     */
    if (!replacement) {
      return res.status(200).json({
        success: true,
        message:
          "KYC failed. Winner removed. No eligible replacement found.",
        replacement: null,
      });
    }


    /*
     * Save replacement.
     */
    const replacementSaved =
      await prisma.winner.create({
        data: {
          userId:
            String(replacement.creatorId),

          slotKey:
            winner.slotKey,

          prizeTier:
            replacement.prizeTier,

          prizeName:
            replacement.prizeName,

          status: "ACTIVE",

          kycStatus:
            "NOT_REQUESTED",
        },
      });


    return res.status(200).json({
      success: true,

      message:
        "KYC failed. Winner removed and slot cascaded.",

      removedWinnerId:
        winner.id,

      replacement:
        replacementSaved,
    });

  } catch (error) {
    console.error(
      "KYC failure error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to process KYC failure",
    });
  }
};  


module.exports = {
  requestKyc,
  markKycPassed,
  markKycFailed,
};