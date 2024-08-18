import RecipeModel from "@/models/Recipe";
import UserModel from "@/models/User";
import type { Recipe } from "@/types";
import mongoose from "mongoose";

export default async function findRecipesForUserById(
  userId: string,
  ownerId: string,
  startIndex: number,
  limit: number
): Promise<Recipe[] | null | boolean> {
  try {
    const user = await UserModel.findOne({ userId });
    if (!user) return false;

    const id = user._id;

    const recipes = await RecipeModel.aggregate([
      {
        $match: {
          ownerId: id,
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
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $project: {
          _id: 1,
          recipeId: 1,
          name: 1,
          url: 1,
          ingredients: 1,
          instructions: 1,
          createdAt: 1,
          updatedAt: 1,
          meal: 1,
          tags: 1,
          images: 1,
          "owner._id": 1,
          "owner.userId": 1,
          "owner.username": 1,
          "owner.url": 1,
          "owner.avatarUrl": 1,
          likesInfo: {
            $filter: {
              input: "$likesInfo",
              as: "like",
              cond: { $eq: ["$$like.status", true] },
            },
          },
          // count comment
          comment: {
            $size: "$comments",
          },
          isOwner: {
            $cond: {
              if: {
                $eq: ["$ownerId", new mongoose.Types.ObjectId(ownerId)],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $addFields: {
          likes: { $size: "$likesInfo" },
          isLiked: {
            $cond: {
              if: {
                $in: [ownerId.toString(), "$likesInfo.ownerId"],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          likesInfo: 0,
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

    console.log(recipes);

    return recipes;
  } catch (error) {
    console.log(error);
    return null;
  }
}
