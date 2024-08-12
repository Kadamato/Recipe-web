"use client";
import Image from "next/image";

export default function RecipeImageItem({
  url,
  index,
  handleDeleteImage,
}: {
  url: string;
  index: number;
  handleDeleteImage: Function;
}) {
  return (
    <div
      className={`rounded-lg h-[110px] relative  w-[110px] min-w-[110px] h-[110px] last:mr-0 mr-2  `}
    >
      <Image
        src={url}
        alt="Recipe image"
        width={100}
        height={100}
        className="w-full h-full object-cover rounded-lg"
      />
      <div
        className="bg-black p-[4px] absolute top-1 right-1 rounded-full"
        onClick={() => handleDeleteImage(index)}
      >
        <Image
          src="/close.svg"
          alt=""
          width={100}
          height={100}
          className="w-[18px] cursor-pointer "
        />
      </div>
    </div>
  );
}
