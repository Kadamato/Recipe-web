"use client";

import useSWR, { preload } from "swr";

import RecipeCard from "./RecipeCard";

import type { Recipe } from "@/types";
import SpinnerLoading from "./SpinnerLoading";
import { useEffect } from "react";

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

// preload("/api/recipes", fetcher);

export default function RecipeCardList({ ownerId }: { ownerId: string }) {
  const {
    data: recipes,
    error,
    isLoading,
  } = useSWR("/api/recipes", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 30 * 60 * 1000,
  });

  useEffect(() => {
    preload("/api/recipes", fetcher);
  }, []);

  if (isLoading) return <SpinnerLoading />;

  if (error)
    return (
      <div className="h-[100vh] flex justify-center ">Failed to fetch data</div>
    );

  return (
    <div className="flex flex-col items-center justify-center">
      {recipes?.map((recipe: Recipe) => {
        return (
          <RecipeCard
            key={recipe.recipeId}
            recipe={recipe}
            ownerId={ownerId || ""}
          />
        );
      })}
    </div>
  );
}
