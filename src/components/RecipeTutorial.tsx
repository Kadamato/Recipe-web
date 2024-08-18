"use client";
import geminiPrompt from "@/lib/gemini";
import { useEffect, useTransition, useState } from "react";

export default function RecipeTutorial({ query }: { query: string }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<String>("");

  useEffect(() => {
    setMessage("");

    startTransition(async () => {
      const prompt = geminiPrompt(query);
      for await (const text of prompt) {
        setMessage((prev) => prev + text);
      }
    });
  }, [query]);

  return (
    <div className="">
      <h1 className="text-[16px] font-semibold pb-3 pt-3 ">
        Search for: {query}
      </h1>

      <div className="text-left  leading-7 w-full">{message}</div>
    </div>
  );
}
