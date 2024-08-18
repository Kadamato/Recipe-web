import CommentModel from "@/models/Comment";

export default async function findCommentAndUpdateById(
  ownerId: string,
  recipeId: string,
  commentId: string,
  message: string
) {
  try {
    const comment = await CommentModel.findOneAndUpdate(
      {
        _id: commentId,
        recipeId,
        ownerId,
      },
      {
        $set: {
          message,
        },
      },
      {
        new: true,
      }
    );

    if (!comment) return null;

    return comment;
  } catch (error) {
    return null;
  }
}
