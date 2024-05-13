const mongoose = require('mongoose');

// Define the schema for the collection
const userSchema = new mongoose.Schema({
    f_Id: {
        type: String,
        required: true,
    },
    f_Name: {
        type: String,
        required: true
    },
    f_Email: {
        type: String,
        required: true,
        unique: true
    },
    f_Mobile: {
        type: String,
        required: true
    },
    f_Designation: {
        type: String,
        required: true
    },
    f_gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    f_Course: {
        type: [String],
        required: true
    },
    f_Image:{
        type: String,
        required: true
        
    },
    f_Createdate: {
        type: Date,
        default: Date.now
    }
});

// Create the model using the schema
const User = mongoose.model('Employee', userSchema);

module.exports = User;