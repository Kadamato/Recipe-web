import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/auth/auth";
import type { User } from "@/types";
import findLikeByRecipeAndOwnerId from "@/lib/services/findLikeByRecipeAndOwnerId";
import findLikeAndUpdateById from "@/lib/services/findLikeAndUpdateById";
import setLikeRecipe from "@/lib/services/setLikeRecipe";
import getRecipeIdFromUrlPath from "@/lib/helper/getRecipeIdFromUrlPath";

export async function GET(request: Request) {
  const user = (await validateRequest()) as User;
  const ownerId = user?.id || "";
  const recipeId = getRecipeIdFromUrlPath(request.url);

  if (!user)
    return Response.json(
      {
        data: null,
        error: "sign in to like recipe",
      },
      {
        status: 401,
      }
    );

  try {
    const isLiked = await findLikeByRecipeAndOwnerId(recipeId, String(ownerId));

    const like = await findLikeAndUpdateById(ownerId || "", recipeId);

    if (!isLiked) {
      if (!like)
        return Response.json({
          data: null,
          error: "Error liking recipe",
        });

      const updateLikeForRecipe = await setLikeRecipe(
        recipeId,
        like?._id || ""
      );
      if (!updateLikeForRecipe)
        return Response.json({
          data: null,
          error: "Error liking recipe",
        });

      return Response.json({
        data: "Recipe liked successfully",
        error: null,
        isLiked: like.status,
      });
    } else {
      if (!like)
        return Response.json({ data: null, error: "Error liking recipe" });

      return Response.json({
        data: "Recipe unliked successfully",
        error: null,
        isLiked: like.status,
      });
    }
  } catch (error) {
    return Response.json(
      { data: null, error: error },
      {
        status: 500,
      }
    );
  }
}
