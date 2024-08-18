import UserModel from "@/models/User";
import RecipeModel from "@/models/Recipe";
import mongoose from "mongoose";

export async function findUserAndSetFavorite(
  ownerId: string,
  recipeId: string
) {
  try {
    let result = null;
    const user = await UserModel.findOne({ _id: ownerId });
    const recipe = await RecipeModel.findOne({ _id: recipeId });

    if (!user || !recipe) return null;

    const index = user.favorites.indexOf(recipeId);
    const recipeIndex =
      recipe.saves?.indexOf(new mongoose.Types.ObjectId(ownerId)) ?? -1;

    if (index !== -1) {
      user.favorites.splice(index, 1);
      recipe.saves?.splice(recipeIndex ?? 0, 1);

      result = {
        message: "unsaved successfully",
        isSaved: false,
      };
    } else {
      user.favorites.push(recipeId);
      recipe.saves?.push(new mongoose.Types.ObjectId(ownerId));

      result = {
        message: "saved successfully",
        isSaved: true,
      };
    }

    await user.save();
    await recipe.save();

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}
