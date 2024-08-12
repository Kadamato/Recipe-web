"use client";
import Image from "next/image";

export default function TagItem({
  tagName,
  index,
  handleDeleteTag,
}: {
  tagName: string;
  index: number;
  handleDeleteTag: Function;
}) {
  return (
    <div className="flex items-center text-[15px] pt-2">
      <p>{tagName}</p>
      <div className="" onClick={() => handleDeleteTag(index)}>
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
