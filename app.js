// Require modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Initialize Express
const app = express();

// Set view engine and middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB (using async/await with try-catch for error handling)
async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://deepaligobare07:Root123@cluster0.zny4oma.mongodb.net/blogDB",
      {}
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Define Post Schema and Model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", postSchema);

// Routes
app.get("/", async function (req, res) {
  try {
    const posts = await Post.find({});
    res.render("home", { posts: posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Error fetching posts");
  }
});

// Define delete route using Async/Await
app.get("/delete/:postId", async function (req, res) {
  const requestedPostId = req.params.postId;

  try {
    await Post.findByIdAndDelete(requestedPostId);
    console.log("Successfully deleted the post.");
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Error deleting post");
  }
});

// Define update route using Async/Await
app.get("/update/:postId", async function (req, res) {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findById(requestedPostId);
    res.render("update", {
      id: post._id,
      title: post.title,
      content: post.content,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).send("Error updating post");
  }
});

// Define update POST route using Async/Await
app.post("/update", async function (req, res) {
  const postId = req.body.id;

  try {
    await Post.findByIdAndUpdate(postId, {
      title: req.body.postTitle,
      content: req.body.postBody,
    });
    console.log("Successfully updated the post.");
    res.redirect("/");
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).send("Error updating post");
  }
});

// Define create route using Async/Await
app.get("/create", function (req, res) {
  res.render("create");
});

// Define create POST route using Async/Await
app.post("/create", async function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  try {
    await post.save();
    res.redirect("/");
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("Error creating post");
  }
});

app.get("/posts/:postId", async function (req, res) {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({ _id: requestedPostId });
    res.render("post", { title: post.title, content: post.content });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send("Error fetching post");
  }
});

// Start server
app.listen(3000, async function () {
  await connectDB();
  console.log("Server started on port 3000");
});
