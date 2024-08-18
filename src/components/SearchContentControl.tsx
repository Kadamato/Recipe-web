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

  if (
    type != TAB_STATUS.RECIPE &&
    type != TAB_STATUS.USER &&
    type != TAB_STATUS.TUTORIAL
  ) {
    return <div>Cannot found any result</div>;
  }
  return (
    <div className="lg:w-4/5 w-full ">
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
