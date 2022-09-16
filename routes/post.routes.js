const router = require("express").Router();
const mongoose = require("mongoose");
const Post = require("../models/Posts.model");
const User = require("../models/User.model");
const Comments = require("../models/comments.model");

//post-list
router.get("/post", (req, res) => {
  Post.find()
    .populate("author")
    .then((post) => {
      console.log(post);
      res.render("post/post", { post: post });
    });
});

//get-create
router.get("/create", (req, res) => {
  res.render("post/form-create");
});

//post-create/
router.post("/create", (req, res) => {
  console.log(req.body);
  console.log(req.session);
  const object = { ...req.body, author: req.session.user._id };

  Post.create(object).then((newPost) => {
    res.redirect("/post/post");
  });
});

//id-post
router.get("/:postId", (req, res, next) => {
  const { postId } = req.params;

  /* Post.findById(req.params.postId)
    .then(details => {
      res.render("post/details", details)   
    });*/

  Post.findById(postId)
    .populate("author comments") // <-- the same as .populate('author).populate('comments')
    .populate({
      // we are populating author in the previously populated comments
      path: "comments",
      populate: {
        path: "author",
        model: "User",
      },
    })
    .then((foundPost) => res.render("post/details", foundPost))
    .catch((err) => {
      console.log(`Err while getting a single post from the  DB: ${err}`);
      next(err);
    });
});

//edit post

router.get("/:id/edit", (req, res) => {
  Post.findById(req.params.id).then((post) => {
    res.render("post/edit", post);
  });
});

router.post("/:id/edit", (req, res) => {
  Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((postUpdate) => {
      res.redirect(`/post/${req.params.id}`);
    })
    .catch((err) => console.log(err));
});

//delete post
router.post("/:postId/delete", (req, res) => {
  Post.findByIdAndDelete(req.params.postId).then((result) => {
    res.redirect("/post/post");
  });
});

module.exports = router;
