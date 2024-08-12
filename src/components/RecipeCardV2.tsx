import type { Recipe } from "../types";

export default function RecipeCardV2({ recipe }: { recipe: Recipe }) {
  return (
    <div className="py-3">
      <div className="underline font-medium capitalize">{recipe?.name}</div>
      <div className="flex items-center">
        <div>author: conmeomaunau</div>
        <div>40 likes</div>
        <div> date </div>
      </div>
    </div>
  );
}
