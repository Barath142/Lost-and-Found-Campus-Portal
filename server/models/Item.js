const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        status: {
            type: String,
            required: true,
            enum: ["Lost", "Found"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Item", itemSchema);