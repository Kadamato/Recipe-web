import { useEffect, useState } from "react";
import RecipeSearchList from "./RecipeSearchList";

import { useInView } from "react-intersection-observer";
import useSWRInfinite from "swr/infinite";
import { TAB_STATUS } from "@/const";

import type { Recipe } from "@/types";

const loadMoreFetcher = async (url: string) => {
  try {
    const resp = await fetch(url);

    if (resp.ok) {
      const data = await resp.json();
      return data;
    }

    throw new Error("Error fetching data");
  } catch (error) {
    throw new Error(`Error fetching data: ${error}`);
  }
};

export default function Recipes({
  query,
  type,
}: {
  query: string;
  type: string;
}) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const { ref, inView } = useInView();
  const { data, size, setSize } = useSWRInfinite(
    (index) =>
      `/api/search?q=${query}&type=${TAB_STATUS.RECIPE}&page=${
        index + 1
      }&limit=20`,
    loadMoreFetcher
  );

  useEffect(() => {
    if (inView) {
      if (data && data.length > 0) {
        setPageIndex((prev) => prev + 1);
        setSize(size + 1);
        setRecipes((prevRecipes) => [...prevRecipes, ...(data ?? [])]);
      }
    }
  }, [inView, data, setSize, size]);

  useEffect(() => {
    (async () => {
      const resp = await fetch(
        `/api/search?q=${query}&type=${TAB_STATUS.RECIPE}&page=1&limit=20`
      );
      const data = await resp.json();
      setRecipes(data);
    })();

    //  cleanup
    return () => {
      setRecipes([]);
    };
  }, [query]);

  return <RecipeSearchList recipes={recipes} query={query} ref={ref} />;
}
