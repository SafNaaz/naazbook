//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();

require('dotenv').config()

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const uri = process.env.ATLAS_URI || 'mongodb://localhost:27017/naazBookDB';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

postSchema = mongoose.Schema({
  title: String,
  date: String,
  content: String,
  likes: Number
})

const Post = new mongoose.model("Post", postSchema);

app.get('/', (req, res) => {
  Post.find((err, posts) => {
    if (err) {
      console.log('no posts found')
    } else {
      res.render('home', { posts: posts })
    }
  })
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.get('/contact', (req, res) => {
  res.render('contact')
})

app.get('/compose', (req, res) => {
  res.render('compose')
})

app.post('/compose', (req, res) => {
  var today = new Date();
  const post = new Post({
    title: _.lowerCase(req.body.postTitle),
    date: today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear(),
    content: req.body.postBody,
    likes: 0
  })
  post.save(post)
  res.redirect('/')
})

app.get("/posts/:postName", (req, res) => {
  const requestedTitle = _.lowerCase(req.params.postName);
  Post.findOne({ title: requestedTitle }, (err, post) => {
    if (err) {
      console.log('no post found with requested title')
    } else {
      if (post !== null) {
        res.render('post', { post: post })
      } else {
        res.redirect('/')
      }
    }
  })
})

app.post('/like', (req, res) => {
  const title = req.body.title;
  const likes = Number.parseInt(req.body.likes) + 1;
  Post.findOneAndUpdate({ title: title }, { $set: { likes: likes } }, (err) => {
    if (!err) {
      console.log('updated successfully')
    }
  })
  res.redirect('/posts/' + title)
})


app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
