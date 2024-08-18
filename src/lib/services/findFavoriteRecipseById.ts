import UserModel from "@/models/User";

import mongoose from "mongoose";

export default async function findFavoriteRecipesByOwnerId(ownerId: string) {
  try {
    const recipes = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(ownerId),
        },
      },
      {
        $lookup: {
          from: "recipes",
          localField: "favorites",
          foreignField: "_id",
          as: "favoriteRecipes",
        },
      },
      {
        $unwind: "$favoriteRecipes",
      },
      {
        $project: {
          _id: "$favoriteRecipes._id",
          name: "$favoriteRecipes.name",
          images: "$favoriteRecipes.images",
          url: "$favoriteRecipes.url",
        },
      },
    ]);

    if (!recipes) return null;
    return recipes;
  } catch (error: any) {
    console.log(error);
    return null;
  }
}
