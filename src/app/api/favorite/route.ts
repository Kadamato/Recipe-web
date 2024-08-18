import { validateRequest } from "@/lib/auth/auth";
import findFavoriteRecipesByOwnerId from "@/lib/services/findFavoriteRecipseById";

export async function GET() {
  const owner = await validateRequest();

  if (!owner) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const recipes = await findFavoriteRecipesByOwnerId(owner.id);

    if (!recipes)
      return Response.json({ error: "No recipes found" }, { status: 404 });

    return Response.json(recipes, {
      status: 200,
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
