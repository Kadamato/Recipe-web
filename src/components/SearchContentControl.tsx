"use client";

import { useSearchParams } from "next/navigation";

import RecipeTutorial from "./RecipeTutorial";
import Users from "./Users";
import Recipes from "./Recipes";
import { TAB_STATUS } from "@/const";

export default function SearchContentControl({ tab }: { tab: string }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const type = searchParams.get("type");

  return (
    <div className=" w-4/5">
      {tab === TAB_STATUS.TUTORIAL && <RecipeTutorial query={query || ""} />}
      {tab === TAB_STATUS.RECIPE && (
        <Recipes query={query || ""} type={type || ""} />
      )}
      {tab === TAB_STATUS.USER && (
        <Users query={query || ""} type={type || ""} />
      )}
    </div>
  );
}
