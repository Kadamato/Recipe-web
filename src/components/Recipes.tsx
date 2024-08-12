"use client";
import RecipeCardV2 from "./RecipeCardV2";

import type { Recipe } from "@/types";
import { Spinner } from "@nextui-org/react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Recipes({
  query,
  type,
}: {
  query: string;
  type: string;
}) {
  //  design api endpoint for search recipes by query and type
  const { data, error, isLoading } = useSWR<Recipe[]>(
    `/api/search?q=${query}&type=${type}`,
    fetcher
  );

  if (isLoading) return <Spinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="pr-10">
      <h1 className="text-[16px] font-semibold pb-2 pt-2">
        Tìm kiếm cho: {query}
      </h1>
      <div>
        {data?.length === 0 ? (
          <p>Không tìm thấy kết quả nào</p>
        ) : (
          data?.map((recipe) => (
            <RecipeCardV2 key={recipe._id?.toString()} recipe={recipe} />
          ))
        )}
      </div>
    </div>
  );
}
