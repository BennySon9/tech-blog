const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

// get all comments
router.get("/", async (req, res) => {
  try {
    const foundComments = await Comment.findAll({
      attributes: ["id", "comment_content", "created_at"],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Post,
          attributes: ["title"],
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
        },
      ],
    });

    if (!foundComments) {
      res.status(400).json({ message: "Unable to find comments at this time" });
      return;
    }

    res.json(foundComments);
  } catch (error) {
    res.status(500).json(error);
  }
});

// create new comment
router.post("/", async (req, res) => {
  try {
    const newComment = await Comment.create({
      comment_content: req.body.comment_content,
      user_id: req.session.user_id,
      post_id: req.body.post_id,
    });

    res.json(newComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

// find comment using id
router.get("/:id", async (req, res) => {
  try {
    const foundComment = await Comment.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "comment_content", "created_at"],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Post,
          attributes: ["title"],
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
        },
      ],
    });

    if (!foundComment) {
      res.status(404).json({ message: "Unable to locate comment" });
      return;
    }

    res.json(foundComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update a specific comment using id
router.put("/:id", async (req, res) => {
  try {
    const updatedComment = await Comment.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedComment) {
      res.status(404).json({ message: "Unable to locate comment" });
      return;
    }

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete a specific comment
router.delete("/:id", async (req, res) => {
  try {
    const deletedComment = await Comment.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedComment) {
      res.status(404).json({ message: "Unable to locate comment" });
      return;
    }

    res.json(deletedComment);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
