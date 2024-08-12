const mongoose = require('mongoose');

// Define post schema
const postSchema = new mongoose.Schema({
  imageText: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,  // stores the id - objectid is the type of user's id
    ref: 'User'
    //mongoose doesn't know that it is user id, but mongoose doesnt know this thing
    // ref will tell which model this user id belongs 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Array,
    default: []
  }
});

// Create Post model
module.exports = mongoose.model('Post', postSchema);


