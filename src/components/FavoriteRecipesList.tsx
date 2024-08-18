"use client";
import FavoriteCard from "./FavoriteCard";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

const fetcher = (url: string, { arg }: { arg: string }) =>
  fetch(url + arg).then((res) => res.json());

export default function FavoriteRecipesList({
  recipes,
}: {
  recipes: object[];
}) {
  const [recipeList, setRecipeList] = useState(recipes);

  const { trigger } = useSWRMutation(`/api/recipes/`, fetcher);

  const handleDelete = async (recipeId: string) => {
    const resp = await trigger(`${recipeId}/save`);

    if (resp) {
      setRecipeList((prev) =>
        prev.filter((recipe: any) => recipe._id !== recipeId)
      );
    }
  };
  return (
    <div className="lg:px-12 pt-3 px-3">
      <div className="mb-5 font-medium text-xl"> Favorite Recipe</div>
      <div className="flex items-center w-full flex-wrap justify-center lg:justify-start">
        {recipeList.map((recipe: any) => {
          return (
            <FavoriteCard
              key={recipe._id}
              recipe={recipe}
              handleDelete={handleDelete}
            />
          );
        })}
      </div>
    </div>
  );
}
