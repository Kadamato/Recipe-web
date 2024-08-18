import { validateRequest } from "@/lib/auth/auth";
import getRecipeIdFromUrlPath from "@/lib/helper/getRecipeIdFromUrlPath";
import getRecordLimit from "@/lib/helper/getRecordLimit";
import findCommentByRecipeId from "@/lib/services/findCommentByRecipeId";
import findCommentByRecipeIdForGuest from "@/lib/services/findCommentByRecipeIdForGuest";

export async function GET(req: Request) {
  const owner = await validateRequest();
  const ownerId = owner?.id || "";
  const recipeId = getRecipeIdFromUrlPath(req.url);
  const { startIndex, limit } = getRecordLimit(req.url);


  if (!owner) {
    const comments = await findCommentByRecipeIdForGuest(
      recipeId,
      startIndex,
      limit
    );

    if (!comments) {
      return Response.json({ data: null, error: "Cannot found any comments" });
    }

    return Response.json({ data: comments, error: null });
  } else {
    try {
      const comments = await findCommentByRecipeId(
        recipeId,
        ownerId,
        startIndex,
        limit
      );

      if (!comments)
        return Response.json({ data: null, error: "Error fetching comments" });

      return Response.json({ data: comments, error: null });
    } catch (error) {
      return Response.json({ data: null, error: "Error fetching comments" });
    }
  }
}
