import RecipeModel from "@/models/Recipe";
import type { Recipe } from "@/types";

export default async function findRecipeByName(
  name: string,
  startIndex: number,
  limit: number
): Promise<Recipe[] | boolean | null> {
  try {
    const recipes = await RecipeModel.aggregate([
      {
        $lookup: {
          from: "likes",
          localField: "likes",
          foreignField: "_id",
          as: "likesInfo",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $project: {
          name: 1,
          url: 1,
          createdAt: 1,
          "owner.username": 1,
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
        $addFields: {
          likes: { $size: "$likesInfo" },
        },
      },
      {
        $project: {
          likesInfo: 0,
        },
      },
      {
        $match: {
          name: { $regex: new RegExp(name, "i") },
        },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);

    if (!recipes) return false;


    return recipes;
  } catch (error) {
    console.log(error);
    return null;
  }
}
