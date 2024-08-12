import RecipeModel from "@/models/Recipe";
import mongoose from "mongoose";
export default async function getLikes(
  recipeId: string
): Promise<number | null> {
  try {
    //  count like of recipe by recipeId

    const [recipe] = await RecipeModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(recipeId),
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "likes",
          foreignField: "_id",
          as: "likesInfo",
        },
      },
      {
        $project: {
          likesInfo: {
            $filter: {
              input: "$likesInfo",
              as: "like",
              cond: { $eq: ["$$like.status", true] },
            },
          },
        },
      },
      {
        $project: {
          likes: {
            $size: "$likesInfo",
          },
        },
      },
    ]);

    return recipe.likes as number;
  } catch (error: any) {
    throw new Error(error);
  }
}
