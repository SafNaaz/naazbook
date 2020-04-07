const express = require('express');
const router = express.Router();
const _ = require('lodash');
const Post = require('../models/post.model');
const Comment = require('../models/post.model');

router.get('/', (req, res) => {
    Post.find((err, posts) => {
        if (err) {
            console.log('no posts found')
        } else {
            res.render('home', { posts: posts })
        }
    })
})

router.get('/about', (req, res) => {
    res.render('about')
})

router.get('/contact', (req, res) => {
    res.render('contact')
})

router.get('/compose', (req, res) => {
    res.render('compose')
})

router.post('/compose', (req, res) => {
    var today = new Date();
    const post = new Post({
        title: req.body.postTitle,
        date: today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear(),
        content: req.body.postBody,
        likes: 0,
        comments: []
    })
    post.save(post).then(() => {
        res.redirect('/delete')
    }).catch((err) => {
        console.log(err)
    })
})

router.get("/posts/:postName", (req, res) => {
    const requestedTitle = req.params.postName;
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

router.post('/like', (req, res) => {
    const postId = req.body.postId;
    const title = req.body.postTitle;
    const likes = Number.parseInt(req.body.likes) + 1;
    Post.findOneAndUpdate({ _id: postId }, { $set: { likes: likes } }, (err) => {
        if (!err) {
            console.log('updated successfully')
        }
    }).then(res.redirect('/posts/' + title));
})

router.post('/comment', (req, res) => {
    const today = new Date();

    Post.findByIdAndUpdate(req.body.postId, {
        $push: {
            comments: {
                name: req.body.name,
                date: today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear(),
                comment: req.body.comment
            }
        }
    }).then(res.redirect('/posts/' + req.body.postTitle)).catch((err) => { console.log(err) })
})

router.post('/likeComment', (req, res) => {
    const commentId = req.body.commentId;
    const postId = req.body.postId;
    const title = req.body.postTitle;
    const likes = (!req.body.likes) ? 1 : Number.parseInt(req.body.likes) + 1;

    Post.updateOne({ _id: postId, comments: { $elemMatch: { _id: commentId } } }, { $set: { "comments.$.likes": likes } }).catch(err => {
        console.log('error while updating' + err)
    }).then(() => {
        res.redirect('/posts/' + title)
    })
})

router.post('/deleteComment', (req, res) => {
    console.log(req.body.post)
    const post = JSON.parse(req.body.post);
    const commentId = req.body.commentId;
    console.log(commentId)
    Post.update({ _id: post._id }, { $pull: { comments: { _id: commentId } } })
        .catch(err => {
            console.log('error while updating' + err)
        }).then(() => {
            post.comments.pop(commentId);
            res.render('edit', { post: post })
        })
})


//manage posts

router.get('/manage', (req, res) => {
    res.render('manage');
})

router.get('/delete', (req, res) => {
    Post.find((err, posts) => {
        if (err) {
            console.log('no posts found')
        } else {
            res.render('managePosts', { posts: posts })
        }
    })

})

router.post('/update', (req, res) => {
    var today = new Date();

    Post.findOneAndUpdate({ _id: req.body.postId }, {
        $set: {
            title: req.body.postTitle,
            date: today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear(),
            content: req.body.postBody,
        }
    }
    ).then(res.redirect('/delete')).catch((err) => { console.log(err) })

})

router.post('/delete', (req, res) => {
    const postId = req.body.postId;
    Post.findOneAndDelete({ "_id": postId }, (err) => {
        if (!err) {
            console.log('deleted successfully')
        }
        res.redirect('/delete')
    })
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username === 'NaaZBhai' && password === 'BhaiRocks') {
        res.redirect('/manage');
    } else {
        res.redirect('/')
    }
})

router.post('/edit', (req, res) => {
    const post = JSON.parse(req.body.post);
    res.render('edit', { post: post })
})

module.exports = router;