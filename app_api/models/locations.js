const mongoose = require("mongoose");


const openingTimeSchema = new mongoose.Schema({
    days: {
        type: String,
        required: true
    },
    opening: String,
    closing: String,
    closed: {
        type: Boolean,
        required: true
    }
});


const reviewSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    reviewText: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    }
});


const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: String,
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    facilities: [String],
    coords: { //TODO: вот это не пойдет надо переписать схему
        type: [Number],
        required: true,
        index: "2dsphere"
    },
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});


// 3 параметр название коллекции MongoDB - необязательный
mongoose.model("Location", locationSchema);