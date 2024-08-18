import RecipeModel from "@/models/Recipe";
import type { Recipe } from "@/types";

export default async function findFavoriteRecipeById(ownerId: string) {
  try {
    const recipes = await RecipeModel.find({ ownerId });

    if (!recipes) return null;

    return recipes;
  } catch (error: any) {
    console.log(error);
    return null;
  }
}
