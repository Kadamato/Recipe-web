"use client";

import { useEffect, useState } from "react";
import { TAB_STATUS } from "@/const";
import { useInView } from "react-intersection-observer";
import useSWRInfinite from "swr/infinite";
import type { User } from "@/types";
import UserSearchList from "./UserSearchList";

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

export default function Users({
  query,
  type,
}: {
  query: string;
  type: string;
}) {
  const [userList, setUsers] = useState<User[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const { ref, inView } = useInView();
  const {
    data: users,
    size,
    setSize,
  } = useSWRInfinite(
    (index) =>
      `/api/search?q=${query}&type=${TAB_STATUS.RECIPE}&page=${
        index + 1
      }&limit=20`,
    loadMoreFetcher
  );

  useEffect(() => {
    if (inView) {
      if (users?.length === 0) return;
      setPageIndex((prev) => prev + 1);
      setSize(size + 1);
    }
  }, [inView, pageIndex, users, setSize, size]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `/api/search?q=${query}&type=${TAB_STATUS.USER}&page=${pageIndex}&limit=20`
        );

        if (!resp.ok) {
          throw new Error("Error fetching data");
        }
        const data = await resp.json();
        setUsers(data);
      } catch (error: any) {
        throw new Error(`Error fetching data: ${error}`);
      }
    })();
  }, [query]);
  // if (error) return <p>{error}</p>;

  return <UserSearchList query={query} users={userList} ref={ref} />;
}
