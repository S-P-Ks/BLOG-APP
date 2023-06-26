import mongoose from "mongoose";

export const CategorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Category = new mongoose.model("Category", CategorySchema);

export default Category;
