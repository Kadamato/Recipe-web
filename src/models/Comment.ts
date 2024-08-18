import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    recipeId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Recipe",
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CommentModel =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default CommentModel;
