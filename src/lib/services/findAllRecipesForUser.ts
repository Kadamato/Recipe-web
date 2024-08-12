import RecipeModel from "@/models/Recipe";

export default async function getAllRecipeForUser(ownerId: string) {
  //  get recipes
  //  info recipe
  //  info user
  //  info like - count like
  //  status like

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
        $limit: 30,
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
