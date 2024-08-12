import RecipeModel from "@/models/Recipe";
import UserModel from "@/models/User";

export default async function findRecipesForGuestById(userId: string) {
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
        $limit: 30,
      },
    ]);

    if (!recipes) return false;

    return recipes;
  } catch (error) {
    console.log(error);
    return null;
  }
}
