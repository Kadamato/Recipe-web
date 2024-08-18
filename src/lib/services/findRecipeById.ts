import RecipeModel from "@/models/Recipe";
import mongoose from "mongoose";

export default async function findRecipeById(
  recipeId: string,
  ownerId: string
) {
  try {
    const recipe = await RecipeModel.aggregate([
      {
        $match: {
          recipeId,
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
          comments: 1,
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
    ]);

    if (!recipe) return null;

    return recipe[0];
  } catch (error) {
    return null;
  }
}
