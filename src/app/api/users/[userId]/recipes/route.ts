import { validateRequest } from "@/lib/auth/auth";
import findRecipesForGuestById from "@/lib/services/findRecipesForGuestById";

import findRecipesForUserById from "@/lib/services/findRecipesForUserById";
import { Recipe } from "@/types";
import { NextRequest } from "next/server";

type Response = {
  recipes: Recipe[] | null;
  error: string;
};

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const user = await validateRequest();

  const ownerId = user?.id ?? "";
  const userId = params.userId;

  if (!ownerId) {
    try {
      const recipes = await findRecipesForGuestById(userId);

      if (!recipes)
        return Response.json(
          {
            recipes: null,
            message: "No recipes available",
          },
          {
            status: 404,
          }
        );

      return Response.json(
        { recipes },
        {
          status: 200,
        }
      );
    } catch (error: any) {
      return Response.json({ message: error.message }, { status: 500 });
    }
  }

  try {
    const recipes = (await findRecipesForUserById(userId, ownerId)) as Recipe[];

    if (!recipes)
      return Response.json(
        {
          recipes: null,
          message: "No recipes available",
        },
        {
          status: 404,
        }
      );

    return Response.json(
      { recipes },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
