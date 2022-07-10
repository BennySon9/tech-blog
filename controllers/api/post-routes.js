const router = require("express").Router();

const { User, Post, Comment } = require("../../models");

// get all post
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

// login to create posts
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

// get single post using id number
router.get("/:id", async (req, res) => {
  try {
    const foundPost = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "post_content"],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          attributes: ["comment_content", "created_at"],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
      ],
    });

    if (!foundPost) {
      res.status(404).json({ message: "Unable to locate post by that id" });
      return;
    }

    res.json(foundPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

// edit a post by id number
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedPost) {
      res.status(404).json({ message: "Unable to locate post by that id" });
      return;
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete post by id
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedPost) {
      res.status(404).json({ message: "Unable to locate post by that id" });
      return;
    }

    res.json({ message: "Post successfully deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
