import mongoose, { Schema, Types } from "mongoose";
import type { Recipe } from "@/types";

const recipeSchema = new Schema(
  {
    name: {
      type: String,
    },
    recipeId: {
      type: String,
      required: true,
      unique: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    url: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    instructions: {
      type: [String],
      required: true,
    },
    meal: {
      type: [String],
      required: true,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "Like",
    },
    images: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RecipeModel =
  (mongoose.models.Recipe as mongoose.Model<Recipe>) ||
  mongoose.model<Recipe>("Recipe", recipeSchema);

export default RecipeModel;
