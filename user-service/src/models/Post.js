const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        media: {
            type: {
                type: String,
                enum: ["image", "video"],
                required: true
            },

            path: {
                type: String,
                required: true
            }
        },

        caption: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },

        category: {
            type: String,
            required: true,
            index: true
        },

        likesCount: {
            type: Number,
            default: 0,
            min: 0
        },

        commentsCount: {
            type: Number,
            default: 0,
            min: 0
        },

        viewsCount: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema);