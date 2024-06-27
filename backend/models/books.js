const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const bookSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String },
    ratings: [
        {
            userId: { type: String },
            grade: { type: Number },
        },
    ],
    averageRating: { type: Number },
});

bookSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Book", bookSchema);
