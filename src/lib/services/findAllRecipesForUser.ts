import RecipeModel from "@/models/Recipe";
import mongoose from "mongoose";

import type { Recipe } from "@/types";

export default async function getAllRecipeForUser(
  ownerId: string,
  startIndex: number,
  limit: number
) {
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
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "recipeId",
          as: "comments",
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
          ownerId: 1,
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
          isOwner: {
            $cond: {
              if: {
                $eq: ["$ownerId", new mongoose.Types.ObjectId(ownerId)],
              },
              then: true,
              else: false,
            },
          },
          isSaved: {
            $in: [new mongoose.Types.ObjectId(ownerId), "$saves"],
          },
          comment: { $size: "$comments" },
        },
      },
      {
        $addFields: {
          likes: { $size: "$likesInfo" },
          isLiked: {
            $cond: {
              if: {
                $in: [ownerId, "$likesInfo.ownerId"],
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
    return recipes;
  } catch (error) {
    console.log(error);
    return null;
  }
}

//  problem 1 : count like with true status
// problem 2 : check yourself like or not
