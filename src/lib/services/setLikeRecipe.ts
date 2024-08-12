import RecipeModel from "@/models/Recipe";
import mongoose from "mongoose";

export default async function setLikeRecipe(
  recipeId: string,
  likeId: string
): Promise<boolean | null> {
  try {
    const updateLike = await RecipeModel.findByIdAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(recipeId),
      },
      {
        $push: { likes: likeId },
      }
    );

    if (!updateLike) return null;
    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
}
