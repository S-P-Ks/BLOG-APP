import mongoose from "mongoose";

const schema = mongoose.Schema;

export const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    likes: [
      {
        type: schema.Types.ObjectId,
        ref: "User",
      },
    ],
    author: {
      type: schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Post = new mongoose.model("Post", PostSchema);

export default Post;
