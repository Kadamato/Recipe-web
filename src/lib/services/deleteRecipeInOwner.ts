import mongoose from "mongoose";
import UserModel from "@/models/User";

export default async function deleteRecipeInOwner(
  recipeId: string,
  ownerId: string
) {
  try {
    const recipe = await UserModel.updateOne(
      { _id: new mongoose.Types.ObjectId(ownerId) },
      { $pull: { recipes: new mongoose.Types.ObjectId(recipeId) } }
    );

    if (!recipe) return null;

    return true;
  } catch (error) {
    console.error("Error in deleteRecipeInOwner: ", error);
    return null;
  }
}
