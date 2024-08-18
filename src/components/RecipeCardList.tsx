"use client";

import RecipeCard from "./RecipeCard";

import type { Recipe } from "@/types";
import { useEffect, useState } from "react";

import InfiniteScroll from "./InfiniteScroll";
import { useInView } from "react-intersection-observer";
import useSWRInfinite from "swr/infinite";

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

export default function RecipeCardList({ recipes }: { recipes: Recipe[] }) {
  const { ref, inView } = useInView();
  const [pageIndex, setPageIndex] = useState<number>(1);

  const [recipeList, setRecipeList] = useState<Recipe[]>(recipes);

  const { data, error, size, setSize } = useSWRInfinite(
    () => `/api/recipes?page=${pageIndex + 1}&limit=45`,
    fetcher
  );

  useEffect(() => {
    if (inView) {
      const recipes = data?.[0];
      if (recipes && recipes.length > 0) {
        setSize((prevSize) => prevSize + 1);
        setPageIndex((prevIndex) => prevIndex + 1);
        setRecipeList((prevList) => [...prevList, ...recipes]);
      }
    }
  }, [inView, data, setSize, setPageIndex, setRecipeList]);

  return (
    <div className="flex flex-col items-center justify-center px-2">
      {recipeList?.map((recipe: Recipe) => {
        return <RecipeCard key={recipe.recipeId} recipe={recipe} />;
      })}

      <div ref={ref}>{recipeList?.length > 0 && <InfiniteScroll />}</div>
    </div>
  );
}
