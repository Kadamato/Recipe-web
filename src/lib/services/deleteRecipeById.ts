import RecipeModel from "@/models/Recipe";

import mongoose from "mongoose";

export default async function deleteRecipeById(
  recipeId: string,
  ownerId: string
) {
  try {
    const recipe = await RecipeModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(recipeId),
    });

    if (!recipe) return null;
    return true;
  } catch (error) {
    console.error("Error in deleteRecipeById: ", error);
    return null;
  }
}
