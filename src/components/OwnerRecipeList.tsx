"use client";

import type { Recipe } from "@/types";
import RecipeCard from "./RecipeCard";
import { useEffect, useState } from "react";
import InfiniteScroll from "./InfiniteScroll";

import { useInView } from "react-intersection-observer";

import useSWRInfinite from "swr/infinite";

const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());

export default function OwnerRecipeList({
  userId,
  ownerId,
  recipes,
}: {
  userId: string;
  ownerId: string;
  recipes: Recipe[];
}) {
  const [recipeList, setRecipeList] = useState<Recipe[]>(recipes);
  const { ref, inView } = useInView();
  const [pageIndex, setPageIndex] = useState<number>(1);

  const { data, error, size, setSize } = useSWRInfinite(
    () => `/api/users/${userId}/recipes?page=${pageIndex + 1}&limit=10`,
    fetcher
  );

  useEffect(() => {
    if (inView) {
      const loadedRecipes = data?.[0]?.recipes;
      if (loadedRecipes && loadedRecipes.length > 0) {
        setSize((prevSize) => prevSize + 1);
        setPageIndex((prevPageIndex) => prevPageIndex + 1);
        setRecipeList((prevRecipeList) => [
          ...prevRecipeList,
          ...loadedRecipes,
        ]);
      }
    }
  }, [inView, data, setSize, setPageIndex, setRecipeList]);

  if (error) return <div> {error}</div>;

  return (
    <div className="w-full lg:w-[70%] lg:pl-5">
      {recipeList?.length > 0 ? (
        recipeList?.map((recipe: Recipe) => (
          <RecipeCard key={recipe?._id?.toString()} recipe={recipe} />
        ))
      ) : (
        <div>No recipes available.</div>
      )}

      <div ref={ref}>{recipeList?.length > 0 && <InfiniteScroll />}</div>
    </div>
  );
}
