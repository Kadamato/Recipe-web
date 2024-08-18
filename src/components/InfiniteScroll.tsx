"use client";
import { Spinner } from "@nextui-org/react";
import useSWRInfinite from "swr/infinite";
import { usePathname } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import RecipeCardList from "./RecipeCardList";
import OwnerRecipeList from "./OwnerRecipeList";


export default function InfiniteScroll() {
  // const userId = usePathname().split("/")[2];

  // const { ref, inView } = useInView();
  // const [pageIndex, setPageIndex] = useState<number>(1);

  // const { data, error, isLoading, mutate } = useSWRInfinite(
  //   () => `/api/users/${userId}/recipes?page=${pageIndex}&limit=30`,
  //   fetcher
  // );

  // useEffect(() => {
  //   if (inView) {
  //     mutate({ ...data?.[0]?.recipes });
  //   }
  // }, [inView]);

  // if (error) return <div> {error}</div>;

  return (
    <>
      <div className="max-w-[555px] w-full text-center mt-3">
        <Spinner size="md" />;
      </div>
    </>
  );
}
