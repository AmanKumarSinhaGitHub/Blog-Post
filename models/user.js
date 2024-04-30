const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blog");

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    posts: [
        { type: mongoose.Schema.Types.ObjectId, ref: "blogPost" }
    ],
});


module.exports = mongoose.model('user', userSchema);