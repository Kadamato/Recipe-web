import CommentItem from "./RecipeDetail/CommentItem";
import type { Comment } from "@/types";

export default function CommentList({
  commentList,
  recipeId,
  handleDeleteComment,
}: {
  commentList: Comment[];
  recipeId: string;
  handleDeleteComment: (commentId: string) => void;
}) {
  return (
    <div className="flex-col items-center justify-center">
      {commentList.length > 0 ? (
        commentList.map((comment) => (
          <div key={comment?.messageId || comment?._id}>
            <CommentItem
              comment={comment}
              recipeId={recipeId}
              handleDeleteComment={handleDeleteComment}
            />
          </div>
        ))
      ) : (
        <div> No comments </div>
      )}
    </div>
  );
}
