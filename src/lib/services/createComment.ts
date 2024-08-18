import CommentModel from "@/models/Comment";
import type { Comment } from "@/types";

export default async function createComment(comment: Comment) {
  try {
    const newComment = new CommentModel(comment);
    const saved = await newComment.save();

    if (!saved) return null;

    return saved;
  } catch (error) {
    return null;
  }
}
