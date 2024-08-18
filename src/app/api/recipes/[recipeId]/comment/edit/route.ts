import { validateRequest } from "@/lib/auth/auth";
import findCommentAndUpdateById from "@/lib/services/findCommentAndUpdateById";

import getRecipeIdFromUrlPath from "@/lib/helper/getRecipeIdFromUrlPath";

export async function POST(request: Request) {
  const owner = await validateRequest();
  const ownerId = owner?.id.toString() || "";

  const { recipeId, commentId, message } = await request.json();

  if (!owner) return Response.json({ data: null, error: "Unauthorized" });

  try {
    const comment = await findCommentAndUpdateById(
      ownerId,
      recipeId,
      commentId,
      message
    );


    if (!comment)
      return Response.json({ data: null, error: "Error updating comment" });

    return Response.json({ data: "Comment updated successfully", error: null });
  } catch (error) {
    return Response.json({ data: null, error: "Error updating comment" });
  }
}
