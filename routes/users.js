const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/trial")

// Define user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  tagline: {
    type: String, // Add tagline field
    default: 'Trust The Process'
  },
  description: {
    type: String, // Add description field
    default: 'Some description'
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  dp: {
    type: String,
    // default: 'default_dp.jpg' // default profile picture
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

userSchema.plugin(plm);

// Create User model
module.exports = mongoose.model('User', userSchema);


