import { formatTime } from "@/lib/helper/formatTime";
import type { RecipeSearchResponse } from "../types";
import Link from "next/link";

export default function RecipeCardV2({
  recipe,
}: {
  recipe: RecipeSearchResponse;
}) {
  const owner = recipe?.owner?.[0];

  console.log();

  return (
    <div className="pb-3">
      <Link
        href={recipe?.url || ""}
        className="underline font-medium capitalize"
      >
        {recipe?.name}
      </Link>
      <div className="flex items-center text-[13px] lg:text-[15px] ">
        <div>Author: {owner?.username || ""}</div>
        <div className="mx-1">• {recipe?.likes || 0} likes</div>
        <div> • {formatTime(recipe?.createdAt ?? new Date())} </div>
      </div>
    </div>
  );
}
