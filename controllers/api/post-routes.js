const router = require("express").Router();
const sequelize = require("../../config/connection");

const { User, Post, Comment } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const foundPosts = await Post.findAll({
      order: [["created_at", "DESC"]],
      attributes: ["id", "title", "post_content", "created_at"],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          attributes: ["id", "comment_content", "created_at"],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
      ],
    });

    if (!foundPosts) {
      res.status(400).json({ message: "Unable to locate posts" });
      return;
    }

    res.json(foundPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.session.isLoggedIn) {
      res
        .status(400)
        .json({ message: "You must be logged in to create a post" });
      return;
    }

    const newPost = await Post.create({
      title: req.body.title,
      post_content: req.body.post_content,
      user_id: req.session.user_id,
    });

    if (!newPost) {
      res.status(400).json({ message: "Unable to create post at this time" });
      return;
    }

    res.json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
