// models/NewsPost.js

const mongoose = require('mongoose');

// Define the schema for a news post
const newsPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true // Removes whitespace from both ends of a string
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Sets the default value to the current date/time
    }
});

// Create the model from the schema
const NewsPost = mongoose.model('NewsPost', newsPostSchema);

module.exports = NewsPost; // Export the model for use in other parts of the application