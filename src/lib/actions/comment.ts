import { validateRequest } from "../auth/auth";
import findCommentByRecipeId from "../services/findCommentByRecipeId";

import type { CommentsResponse } from "@/types";

export async function getComments(recipeId: string): Promise<CommentsResponse> {
  const owner = await validateRequest();
  const ownerId = owner?.id || "";

  const startIndex = 0;
  const limit = 10;

  try {
    const resp = await findCommentByRecipeId(
      recipeId,
      ownerId,
      startIndex,
      limit
    );

    if (!resp)
      return {
        data: null,
        error: "No comments found",
      };

    return {
      data: resp,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: "Something went wrong",
    };
  }
}
