"use client";
import Link from "next/link";
import Image from "next/image";
import { FavoriteRecipe } from "@/types";

export default function FavoriteCard({
  handleDelete,
  recipe,
}: {
  handleDelete: (recipeId: string) => void;
  recipe: FavoriteRecipe;
}) {
  return (
    <div className="lg:w-1/5 mr-3 relative min-w-[240px] mb-3">
      <Link href={recipe?.url || ""}>
        <Image
          src={recipe?.images?.[0] || ""}
          alt=""
          width={150}
          height={100}
          className="rounded-lg mb-2 w-full h-[350px] object-cover"
          objectFit="cover"
          unoptimized={true}
        />
      </Link>

      <Link href={recipe?.url || ""} className="font-medium">
        {recipe?.name || ""}{" "}
      </Link>
      <div
        className="absolute top-2 right-2 bg-black p-2 rounded-full"
        onClick={() => handleDelete(recipe._id || "")}
      >
        <Image src="/remove.svg" alt="heart" width={14} height={14} />
      </div>
    </div>
  );
}
