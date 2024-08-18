"use client";

import type { Recipe, RecipeSearchResponse } from "@/types";
import RecipeCardV2 from "./RecipeCardV2";

import { Spinner } from "@nextui-org/react";

export default function RecipeSearchList({
  recipes,
  query,
  ref,
}: {
  recipes: Recipe[];
  query: string;
  ref: any;
}) {
  return (
    <div className="lg:pr-10">
      <h1 className="text-[16px] font-semibold pb-3 pt-3 ">
        Search for: {query}
      </h1>
      <div>
        {recipes.length === 0 ? (
          <p>No results found</p>
        ) : (
          recipes?.map((recipe) => (
            <RecipeCardV2
              key={recipe._id?.toString()}
              recipe={recipe as RecipeSearchResponse}
            />
          ))
        )}
        {(recipes ?? [])?.length > 0 && (recipes ?? [])?.length > 20 && (
          <div ref={ref}>
            <Spinner size="sm" className="mt-2" />
          </div>
        )}
      </div>
    </div>
  );
}
