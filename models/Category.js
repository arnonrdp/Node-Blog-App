const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

mongoose.model("Category", Category);
