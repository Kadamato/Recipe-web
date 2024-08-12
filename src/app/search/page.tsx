"use client";

import SearchContentControl from "@/components/SearchContentControl";
import SideBar from "@/components/SideBar";

import { useState } from "react";

import { TAB_STATUS } from "@/const";

export default function SearchPage() {
  const [tab, setTab] = useState("tutorial");
  return (
    <div className="lg:px-12 flex  pt-3">
      <SideBar onClick={(tab: string) => setTab(tab)} />
      <SearchContentControl tab={tab} />
    </div>
  );
}
