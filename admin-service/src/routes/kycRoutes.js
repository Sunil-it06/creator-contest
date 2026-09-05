const express = require("express");

const adminAuthMiddleware =
  require("../middleware/adminAuthMiddleware");

const {
  requestKyc,
  markKycPassed,
  markKycFailed,
} = require("../controllers/kycController");

const router = express.Router();

router.use(adminAuthMiddleware);


/*
 * Send KYC request
 */
router.post(
  "/winners/:winnerId/kyc",
  requestKyc
);


/*
 * KYC passed
 */
router.post(
  "/winners/:winnerId/kyc/pass",
  markKycPassed
);


/*
 * KYC failed
 */
router.post(
  "/winners/:winnerId/kyc/fail",
  markKycFailed
);


module.exports = router;