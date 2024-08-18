import { validateRequest } from "@/lib/auth/auth";
import getRecipeIdFromUrlPath from "@/lib/helper/getRecipeIdFromUrlPath";
import findRecipeByRecipeId from "@/lib/services/findRecipeByRecipeId";
import { findUserAndSetFavorite } from "@/lib/services/findUserAndSetFavorite";

export async function GET(request: Request) {
  const owner = await validateRequest();
  const ownerId = owner?.id || "";

  const recipeId = getRecipeIdFromUrlPath(request.url);

  if (!owner) {
    return Response.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const isRecipe = await findRecipeByRecipeId(recipeId);

    if (!isRecipe) {
      return Response.json(
        {
          message: "Recipe not found",
        },
        {
          status: 404,
        }
      );
    }

    const isSaved = await findUserAndSetFavorite(ownerId, recipeId);

    if (!isSaved) {
      return Response.json(
        {
          message: "save failed",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        message: isSaved.message,
        isSaved: isSaved.isSaved,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error);
    return Response.json(
      {
        message: error,
      },
      {
        status: 500,
      }
    );
  }
}
