const { Router } = require("express");
const User = require("../models/user");
const multer = require("multer");

const path = require("path");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/profiles"));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const profile = multer({
  storage: storage,
});

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: error.message,
    });
  }
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/logout", (req, res) => {
  return res.clearCookie("token").redirect("/");
});

router.post("/signup", profile.single("profileImageURl"), async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(req.file);

  console.log(req.body);
  await User.create({
    fullName,
    email,
    password,
    profileImageURl: `profiles/${req.file.filename}`,
  });
  return res.redirect("/user/signin");
});

module.exports = router;
