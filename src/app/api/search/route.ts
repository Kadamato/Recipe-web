import { TAB_STATUS } from "@/const";
import findRecipeByName from "@/lib/services/findRecipeByName";
import type { Recipe } from "@/types";

import getRecordLimit from "@/lib/helper/getRecordLimit";
import findUsersByName from "@/lib/services/findUserByName";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type");
  const { startIndex, limit } = getRecordLimit(req.url);

  const query = q.trim().toLowerCase() as string;

  if (type === TAB_STATUS.USER) {
    try {
      const users = (await findUsersByName(query, startIndex, limit)) as Recipe;

      if (!users)
        return Response.json(
          { data: null, error: "Error finding user" },
          {
            status: 404,
          }
        );

      return Response.json(users, {
        status: 200,
      });
    } catch (error: any) {
      console.log(error);
      return Response.json(
        { data: null, error: error },
        {
          status: 500,
        }
      );
    }
  } else if (type === TAB_STATUS.RECIPE) {
    try {
      const recipes = (await findRecipeByName(
        query,
        startIndex,
        limit
      )) as Recipe;

      if (!recipes)
        return Response.json(
          { data: null, error: "Error finding recipe" },
          {
            status: 404,
          }
        );

      return Response.json(recipes, {
        status: 200,
      });
    } catch (error: any) {
      console.log(error);
      return Response.json(
        { data: null, error: error },
        {
          status: 500,
        }
      );
    }
  } else {
    return Response.json(
      { data: null, error: "Invalid type" },
      {
        status: 400,
      }
    );
  }
}
