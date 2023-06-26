import { Router } from "express";
import Category from "../models/Category.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const page = +req.query.page;
    const limit = +req.query.limit;

    const categories = await Category.find()
      .sort({ updated_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await Category.countDocuments();

    res.status(200).json({ data: categories, total_count: totalCount });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;

    const category = new Category(body);

    await category.save();

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

export default router;
