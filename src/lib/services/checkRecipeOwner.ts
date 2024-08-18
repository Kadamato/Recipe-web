import UserModel from "@/models/User";
import mongoose from "mongoose";

export default async function checkRecipeOwner(
  ownerId: string,
  recipeId: string
) {
  try {
    const recipe = await UserModel.findOne(
      {
        _id: new mongoose.Types.ObjectId(ownerId),
      },
      {
        recipes: { $elemMatch: { $eq: new mongoose.Types.ObjectId(recipeId) } },
      }
    );

    if (!recipe) return null;
    return true;
  } catch (error) {
    console.error("Error in checkRecipeOwner: ", error);
    return null;
  }
}
