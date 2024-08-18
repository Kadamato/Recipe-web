import CommentModel from "@/models/Comment";

export default async function deleteCommentById(
  ownerId: string,
  recipeId: string,
  commentId: string
) {
  try {
    const comment = await CommentModel.findOneAndDelete({
      _id: commentId,
      ownerId,
      recipeId,
    });

    if (!comment) return null;

    return comment;
  } catch (error) {
    return null;
  }
}
