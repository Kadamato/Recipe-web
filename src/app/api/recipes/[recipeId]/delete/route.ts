import { validateRequest } from "@/lib/auth/auth";
import getRecipeIdFromUrlPath from "@/lib/helper/getRecipeIdFromUrlPath";
import deleteRecipeById from "@/lib/services/deleteRecipeById";
import checkRecipeOwner from "@/lib/services/checkRecipeOwner";
import deleteRecipeInOwner from "@/lib/services/deleteRecipeInOwner";

export async function DELETE(req: Request) {
  const recipeId = getRecipeIdFromUrlPath(req.url);
  const owner = await validateRequest();
  const ownerId = owner?.id || "";
  try {
    const isRecipeOwner = await checkRecipeOwner(ownerId, recipeId);

    const deleteRecipe = deleteRecipeById(recipeId, ownerId);
    const deleteRecipeOwner = deleteRecipeInOwner(recipeId, ownerId);

    const isDeleted = await Promise.all([deleteRecipe, deleteRecipeOwner]);

    if (!isDeleted[0] || !isDeleted[1])
      return Response.json(
        {
          message: "Recipe not found",
        },
        {
          status: 404,
        }
      );

    return Response.json(
      {
        message: "Recipe deleted",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
