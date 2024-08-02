const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { checkForAuthenticationCookie } = require("./middlewares/auth");
const Blog = require("./models/blog");

const path = require("path");
const app = express();
const PORT = 8000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
//serve static files for anything insider public folder
app.use(express.static(path.resolve("./public")));

//connect to mongodb
mongoose
  .connect("mongodb://localhost:27017/blogapp")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// import routes
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort("createdAt");
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
