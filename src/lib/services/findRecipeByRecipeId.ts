import RecipeModel from "@/models/Recipe";
import mongoose from "mongoose";

export default async function findRecipeByRecipeId(recipeId: string) {
  try {
    const recipe = await RecipeModel.findOne({
      _id: new mongoose.Types.ObjectId(recipeId),
    });


    if (!recipe) return null;

    return recipe;
  } catch (error: any) {
    console.log(error);
    return null;
  }
}
