const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    date: String,
    comment: {
        type: String,
        required: [true, 'comment is required']
    },
    likes: Number
})

const Comment = new mongoose.model("Comment", commentSchema);
module.exports = Comment;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required']
    },
    date: String,
    content: {
        type: String,
        required: [true, 'content is required']
    },
    likes: Number,
    comments: [commentSchema]
})

const Post = new mongoose.model("Post", postSchema);

module.exports = Post;
