import RecipeModel from "@/models/Recipe";

export default async function findRecipeAndSetCommentById(
  recipeId: string,
  commentId: string
) {
  try {
    const updateComment = await RecipeModel.findOneAndUpdate(
      {
        _id: recipeId,
      },
      {
        $push: {
          comments: commentId,
        },
      }
    );

    if (!updateComment) return null;
    return updateComment;
  } catch (error) {
    return null;
  }
}
