import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    ownerId: {
      type: String,
      required: true,
      ref: "User",
    },
    recipeId: {
      type: String,
      required: true,
      ref: "Recipe",
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LikeModel = mongoose.models.Like || mongoose.model("Like", likeSchema);

export default LikeModel;
