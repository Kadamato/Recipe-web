import { headers } from "next/headers";

import { getRecipeDetail } from "@/lib/actions/recipe";
import RecipeDetailForm from "./RecipeDetailForm";
import RecipeDetailInfo from "./RecipeDetailInfo";

import { getComments } from "@/lib/actions/comment";

import type { Recipe, Comment, User } from "@/types";
import { validateRequest } from "@/lib/auth/auth";

export default async function RecipeDetail() {
  const header = headers();
  const path = header.get("x-current-path");
  const recipeId = path?.split("/")[2] || "";

  const owner = ((await validateRequest()) as User) || ({} as User);
  const recipeResp = await getRecipeDetail(recipeId);
  const commentResp = await getComments(recipeId);

  if (recipeResp?.error || commentResp?.error)
    return <div> cannot found recipe </div>;

  const recipe = (recipeResp?.data as Recipe) || {};
  const comments = (commentResp?.data as Comment[]) || [];


  return (
    <div className="flex flex-col items-center lg:items-start justify-center mt-3 mx-2 lg:flex-row  ">
      <RecipeDetailForm recipe={recipe} owner={owner} />
      <RecipeDetailInfo recipe={recipe} comments={comments} owner={owner} />
    </div>
  );
}
