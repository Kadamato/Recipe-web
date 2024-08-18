import CommentModel from "@/models/Comment";
import RecipeModel from "@/models/Recipe";

export default async function findCommentByRecipeIdForGuest(
  recipeId: string,
  startIndex: number,
  limit: number
) {
  try {
    const comments = await CommentModel.aggregate([
      {
        $match: { recipeId },
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
          updatedAt: 1,
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
