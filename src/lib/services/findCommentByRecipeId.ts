import CommentModel from "@/models/Comment";
import RecipeModel from "@/models/Recipe";

import mongoose from "mongoose";

export default async function findCommentByRecipeId(
  recipeId: string,
  ownerId: string,
  startIndex: number,
  limit: number
) {
  const recipe = await RecipeModel.findOne({ recipeId });
  const id = recipe?._id.toString();

  try {
    const comments = await CommentModel.aggregate([
      {
        $match: { recipeId: new mongoose.Types.ObjectId(id) },
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
        $unwind: "$owner",
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
        $unwind: "$owner",
      },
      {
        $project: {
          _id: 1,
          message: 1,
          ownerId: 1,
          avatarUrl: "$owner.avatarUrl",
          username: "$owner.username",
          url: "$owner.url",
          updatedAt: 1,
          isOwner: {
            $eq: ["$ownerId", ownerId],
          },
        },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);

    if (!comments) return null;

    return comments;
  } catch (error) {
    return null;
  }
}
