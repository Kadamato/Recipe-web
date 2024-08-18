import FavoriteCard from "@/components/FavoriteCard";
import FavoriteRecipesList from "@/components/FavoriteRecipesList";

import { getAllFavoriteRecipes } from "@/lib/actions/favorite";

export default async function FavoritePage() {
  const recipes = await getAllFavoriteRecipes();

  if (!recipes) return <div> Cannot find any favorite recipes </div>;

  return <FavoriteRecipesList recipes={recipes || []} />;
}
