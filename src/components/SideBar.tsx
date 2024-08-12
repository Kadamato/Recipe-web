"use client";
import React, { useTransition } from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { TAB_STATUS } from "@/const";

export default function SideBar({
  onClick,
}: {
  onClick: (tab: string) => void;
}) {
  // const searchParams = useSearchParams();
  // const query = searchParams.get("q");

  return (
    <div className="flex-col items-center pr-10 w-1/5  ">
      <Tab onClick={onClick} currentTab={TAB_STATUS.TUTORIAL}>
        Cook Tutorial
      </Tab>
      <Tab onClick={onClick} currentTab={TAB_STATUS.RECIPE}>
        Recipes
      </Tab>
      <Tab onClick={onClick} currentTab={TAB_STATUS.USER}>
        Users
      </Tab>
    </div>
  );
}

export function Tab({
  onClick,
  children,
  currentTab,
}: {
  onClick: (tab: string) => void;
  children: React.ReactNode;
  currentTab: string;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <div
      className=" pt-2 cursor-pointer block"
      onClick={() =>
        startTransition(() => {
          if (currentTab === TAB_STATUS.TUTORIAL) onClick(TAB_STATUS.TUTORIAL);
          if (currentTab === TAB_STATUS.USER) onClick(TAB_STATUS.USER);
          if (currentTab === TAB_STATUS.RECIPE) onClick(TAB_STATUS.RECIPE);
        })
      }
    >
      {children}
    </div>
  );
}
