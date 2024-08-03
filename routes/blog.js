const express = require("express");
const multer = require("multer");
const Blog = require("../models/blog");
const User = require("../models/user");

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

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  if (!req.user) {
    return res.render("blog", {
      userName: null,
      blog,
      user: req.user,
    });
  }
  const currentUserId = req.user._id;
  const user = await User.find({ _id: currentUserId });
  const userName = user[0].fullName;
  return res.render("blog", {
    user: req.user,
    userName,
    blog,
  });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = await req.body;
  Blog.create({
    title,
    body,
    coverImageURL: `uploads/${req.file.filename}`,
    createdBy: req.user._id,
  });
  return res.redirect("/");
});

module.exports = router;
