import mongoose from "mongoose";
import bcyrpt from "bcrypt";

const schema = mongoose.Schema;

export const UserSchema = mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: String,
    posts: [
      {
        type: schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const pass = this.password;

  const hashedPass = await bcyrpt.hash(pass, 12);

  this.password = hashedPass;
  next();
});

const User = new mongoose.model("User", UserSchema);

export default User;
