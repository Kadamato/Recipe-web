import RecipeCardList from "@/components/RecipeCardList";
import { getRecipeList } from "@/lib/actions/recipe";

import { RecipeResponse } from "@/types";

export default async function Home() {
  const recipes = (await getRecipeList()) as RecipeResponse;
  if (recipes?.error) return <div>Not found </div>;

  return <RecipeCardList recipes={recipes?.data || []} />;
}
