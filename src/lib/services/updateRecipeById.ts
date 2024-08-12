import RecipeModel from "@/models/Recipe";
import type { Recipe } from "@/types";
import mongoose from "mongoose";

export default async function updateRecipeById(
  recipeId: string,
  ownerId: string,
  data: Recipe
): Promise<Recipe | null> {
  try {
    const recipe = await RecipeModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(recipeId),
        ownerId: new mongoose.Types.ObjectId(ownerId),
      },
      data
    );
    return recipe;
  } catch (error: any) {
    console.log(error);
    return null;
  }
}
