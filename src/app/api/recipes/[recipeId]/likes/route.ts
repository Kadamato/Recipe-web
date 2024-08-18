import getRecipeIdFromUrlPath from "@/lib/helper/getRecipeIdFromUrlPath";
import findLikesForRecipeById from "@/lib/services/findLikesForRecipeById";

export async function GET(request: Request) {
  const recipeId = getRecipeIdFromUrlPath(request.url);

  try {
    const likes = await findLikesForRecipeById(recipeId);

    return Response.json(
      { likes },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
