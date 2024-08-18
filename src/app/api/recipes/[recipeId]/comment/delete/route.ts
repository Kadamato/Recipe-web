import { validateRequest } from "@/lib/auth/auth";
import deleteCommentById from "@/lib/services/deleteCommentById";
import deleteCommentInRecipeById from "@/lib/services/deleteCommentInRecipeById";

export async function POST(request: Request) {
  const owner = await validateRequest();
  const ownerId = owner?.id.toString() || "";

  const { recipeId, commentId } = await request.json();

  if (!owner) return Response.json({ data: null, error: "Unauthorized" });

  try {
    const comment = await deleteCommentById(ownerId, recipeId, commentId);

    if (!comment)
      return Response.json(
        { data: null, error: "Error delete comment" },
        {
          status: 400,
        }
      );

    const deleteCommentInRecipe = await deleteCommentInRecipeById(
      recipeId,
      commentId
    );

    if (!deleteCommentInRecipe)
      return Response.json(
        {
          data: null,
          error: "Error delete comment in recipe",
        },
        {
          status: 400,
        }
      );
    return Response.json(
      { data: "Comment deleted successfully", error: null },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      { data: null, error: "Error delete comment" },
      {
        status: 400,
      }
    );
  }
}
