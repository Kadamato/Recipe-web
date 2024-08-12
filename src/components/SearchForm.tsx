"use client";

import SearchIcon from "./ui/SearchIcon";
import { Input } from "@nextui-org/input";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function SearchForm() {
  const router = useRouter();
  const queryRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = queryRef.current?.value;
    router.push("/search?q=" + query + "&type=tutorial");
  };
  return (
    <form onSubmit={handleSearch}>
      <Input
        classNames={{
          base: "max-w-full  h-10",
          mainWrapper: "h-full",
          input: "text-small",
          inputWrapper:
            "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 rounded-[12px]",
        }}
        placeholder="Type to search..."
        size="sm"
        type="search"
        startContent={<SearchIcon />}
        ref={queryRef}
      />
    </form>
  );
}
