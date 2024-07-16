const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    profilePictureURL: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, {timestamps: true});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
