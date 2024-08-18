import RecipeModel from "@/models/Recipe";

export default async function deleteCommentInRecipeById(
  recipeId: string,
  commentId: string
) {
  try {
    const comment = await RecipeModel.updateOne(
      { _id: recipeId },
      { $pull: { comments: commentId } }
    );

    if (!comment) return null;
    return comment;
  } catch (error) {
    return null;
  }
}
