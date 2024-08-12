import type { Recipe } from "@/types";

import RecipeModel from "@/models/Recipe";

export default async function createRecipe(
  recipe: Recipe
): Promise<string | null> {
  try {
    const newRecipe = new RecipeModel(recipe);
    await newRecipe.save();

    const { _id } = newRecipe;

    return _id.toString();
  } catch (error: any) {
    console.log(error);
    return null;
  }
}
