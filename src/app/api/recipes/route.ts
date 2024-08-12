import { validateRequest } from "@/lib/auth/auth";

import type { Recipe, User } from "@/types";

import getAllRecipeForUser from "@/lib/services/findAllRecipesForUser";
import getAllRecipesForGuest from "@/lib/services/getAllRecipesForGuest";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = (await validateRequest()) as User;

  try {
    if (!user) {
      const recipes = (await getAllRecipesForGuest()) as Recipe[];
      return Response.json(recipes, {
        status: 200,
      });
    }

    const recipes = (await getAllRecipeForUser(String(user.id))) as Recipe[];

    return Response.json(recipes, {
      status: 200,
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
