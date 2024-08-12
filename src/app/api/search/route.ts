import findRecipeByName from "@/lib/services/findRecipeByName";

import type { Recipe } from "@/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  try {
    const recipes = (await findRecipeByName(q ?? "")) as Recipe;

    if (!recipes)
      return Response.json({ data: null, error: "Error finding recipe" });

    return Response.json(recipes, {
      status: 200,
    });
  } catch (error: any) {
    return Response.json({ data: null, error: error });
  }
}
