"use client";

import type { Recipe } from "@/types";
import RecipeCard from "./RecipeCard";
import useSWR, { preload } from "swr";
import { Spinner } from "@nextui-org/react";
import SpinnerLoading from "./SpinnerLoading";
import { useEffect, useState } from "react";
import InfiniteScroll from "./InfiniteScroll";

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
  const { data, isLoading, error } = useSWR(
    `/api/users/${userId}/recipes`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const [recipeList, setRecipeList] = useState<Recipe[]>(recipes);

  useEffect(() => {
    preload(`/api/users/${userId}/recipes`, fetcher);
  }, [userId]);

  if (error) return <div>{error}</div>;

  return (
    <div className="w-[70%] pl-5">
      {recipeList?.length > 0 ? (
        recipeList?.map((recipe: Recipe) => (
          <RecipeCard
            key={recipe?._id?.toString()}
            recipe={recipe}
            ownerId={ownerId}
          />
        ))
      ) : (
        <div>No recipes available.</div>
      )}

      <InfiniteScroll/>
    </div>
  );
}
