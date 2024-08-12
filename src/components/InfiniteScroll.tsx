"use client";
import { Spinner } from "@nextui-org/react";
import useSWRInfinite from "swr/infinite";
import { usePathname } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InfiniteScroll() {
  const userId = usePathname().split("/")[2];

  const { data, error, isLoading } = useSWRInfinite(
    () => `/api/users/${userId}/recipes`,
    fetcher
  );

  if (isLoading) return <Spinner />;
  if (error) return <div>{error}</div>;

  console.log(data);
  return <Spinner />;
}
