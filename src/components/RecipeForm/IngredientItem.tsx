"use client";
import Image from "next/image";

export default function IngredientItem({
  ingredientName,
  index,
  handleDeleteIngredient,
}: {
  ingredientName: string;
  index: number;
  handleDeleteIngredient: Function;
}) {
  return (
    <div className="flex items-center text-[15px] pt-2">
      <p>{ingredientName}</p>
      <div className="" onClick={() => handleDeleteIngredient(index)}>
        <Image
          src="/close-black.svg"
          alt=""
          width={100}
          height={100}
          className="w-[18px] cursor-pointer ml-3 "
        />
      </div>
    </div>
  );
}
