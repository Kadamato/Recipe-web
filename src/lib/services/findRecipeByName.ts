import RecipeModel from "@/models/Recipe";
import type { Recipe } from "@/types";

export default async function findRecipeByName(
  name: string
): Promise<Recipe[] | boolean | null> {
  try {
    const recipes = (await RecipeModel.find({
      name: { $regex: name, $options: "i" },
    })) as Recipe[];

    if (!recipes) return false;

    return recipes;
  } catch (error) {
    return null;
  }
}
