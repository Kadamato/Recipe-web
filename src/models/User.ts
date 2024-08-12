import mongoose, { Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    gender: {
      type: String,
      required: true,
    },
    badges: {
      type: [Schema.Types.ObjectId],
      ref: "Badge",
    },
    favorites: {
      type: [Schema.Types.ObjectId],
      ref: "Recipe",
    },
    avatarUrl: {
      type: String,
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    recipes: {
      type: [Schema.Types.ObjectId],
      ref: "Recipe",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
