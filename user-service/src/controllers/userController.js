const User = require("../models/User");

const ALLOWED_RESIDENCY = "Chhattisgarh";

const updateProfile = async (req, res) => {
    try {
        const { residency } = req.body;

        if (!residency || typeof residency !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid residency is required"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                residency: residency.trim()
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isContestEligible =
            user.residency.toLowerCase() === "chhattisgarh";

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                residency: user.residency,
                isContestEligible
            }
        });

    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    getMe,
    updateProfile
};

