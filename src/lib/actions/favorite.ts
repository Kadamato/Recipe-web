import { validateRequest } from "../auth/auth";
import findFavoriteRecipeById from "../services/findFavoriteRecipeById";
import findFavoriteRecipesByOwnerId from "../services/findFavoriteRecipseById";

export async function getAllFavoriteRecipes() {
  const owner = await validateRequest();
  const ownerId = owner?.id || "";
  try {
    const recipes = await findFavoriteRecipesByOwnerId(ownerId);

    if (!recipes) return null;

    return recipes;
  } catch (error: any) {
    console.log(error);
    return null;
  }
}
