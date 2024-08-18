import { validateRequest } from "@/lib/auth/auth";
import createComment from "@/lib/services/createComment";

import getRecipeIdFromUrlPath from "@/lib/helper/getRecipeIdFromUrlPath";
import findRecipeAndSetCommentById from "@/lib/services/findRecipeAndSetCommentById";
export async function POST(req: Request) {
  const owner = await validateRequest();
  const ownerId = owner?.id;
  const recipeId = getRecipeIdFromUrlPath(req.url);

  const { message } = await req.json();

  if (!owner)
    return Response.json(
      { data: null, error: "sign  in to comment " },
      { status: 401 }
    );

  try {
    const resp = await createComment({
      ownerId,
      recipeId,
      message,
    });
    if (!resp)
      return Response.json(
        {
          data: null,
          error: "Error creating comment",
        },
        {
          status: 400,
        }
      );

    const recipe = await findRecipeAndSetCommentById(recipeId, resp?._id);

    if (!recipe)
      return Response.json(
        {
          data: null,
          error: "Error adding comment to recipe",
        },
        {
          status: 400,
        }
      );
    return Response.json(
      { data: resp, error: null },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json({
      data: null,
      error: error,
    });
  }
}
