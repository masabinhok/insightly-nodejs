const express = require("express");
const multer = require("multer");
const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");

const path = require("path");
const router = express.Router();

//storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
});

router.get("/add-new", async (req, res) => {
  if (!req.user) {
    return res.render("addBlog", {
      userName: null,
      user: req.user,
    });
  }
  const currentUserId = req.user._id;
  const user = await User.find({ _id: currentUserId });
  const userName = user[0].fullName;
  return res.render("addBlog", {
    user: req.user,
    userName,
  });
});

router.post("/like/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  blog.likes = blog.likes + 1;
  await blog.save();
  return res.redirect(`/blog/${req.params.id}`);
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");

  const comments = await Comment.find({
    blogId: req.params.id,
  }).populate("createdBy");

  if (!req.user) {
    return res.render("blog", {
      userName: null,
      blog,
      user: req.user,
      comments,
    });
  }

  const currentUserId = req.user._id;
  const user = await User.find({ _id: currentUserId });

  const userName = user[0].fullName;
  console.log(blog, req.user);
  return res.render("blog", {
    currentUserId,
    user: req.user,
    userName,
    blog,
    comments,
  });
});

router.post("/delete/:blogId", async (req, res) => {
  const user = req.user;
  console.log(user);
  const userId = user._id;
  console.log(userId);
  const blog = await Blog.findById(req.params.blogId);
  if (blog.createdBy == userId) {
    await Blog.findByIdAndDelete(req.params.blogId);
    return res.redirect("/");
  }
  return res.redirect("/");
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = await req.body;
  console.log(req.file);
  console.log(req.body);
  console.log(req.user);

  Blog.create({
    title,
    body,
    coverImageURL: `uploads/${req.file.filename}`,
    createdBy: req.user._id,
  });
  return res.redirect("/");
});

module.exports = router;
