import { Router } from "express";
import Post from "../models/Post.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const page = +req.query.page;
    const limit = +req.query.limit;

    // console.log(req.query);

    let posts = [];

    if (req.query.userId) {
      posts = await Post.find({ author: req.session.userId })
        .populate("categories")
        .populate("author")
        .sort({ updated_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      console.log(posts);
    } else {
      posts = await Post.find()
        .populate("categories")
        .populate("author")
        .sort({ updated_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      console.log(posts);
    }

    const totalCount = await Post.countDocuments();

    res.status(200).json({ data: posts, total_count: totalCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/:id", async (req, res) => {
  console.log(req.params);

  try {
    const id = req.params.id;
    const post = await Post.findById(id)
      .populate("author")
      .populate("categories");

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/:id/like/:userId", async (req, res) => {
  console.log(req.params);

  try {
    const id = req.params.id;
    const userId = req.params.userId;

    console.log(id, userId);
    const post = await Post.findById(id);
    let likes = post.likes;

    if (likes.includes(userId)) {
      likes = likes.filter((l) => l != userId);
    } else {
      likes.push(userId);
    }
    // console.log(post);
    await Post.findByIdAndUpdate(id, { likes: likes })
      .then((r) => {
        return res.status(201).json("OK");
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong!" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;

    const post = new Post(body);

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const params = req.params;
    const body = req.body;

    // const post = new Post(body);

    await Post.findByIdAndUpdate(params.id, {
      title: body.title,
      description: body.description,
      content: body.content,
      categories: body.categories,
      imageUrl: body.imageUrl,
    })
      .then((r) => {
        console.log(r);
        return res.status(200).json(r);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong!" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const params = req.params;

    await Post.deleteOne({ _id: params.id })
      .then((r) => {
        console.log(r);
        return res.status(204).json("OK");
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong!" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

export default router;
