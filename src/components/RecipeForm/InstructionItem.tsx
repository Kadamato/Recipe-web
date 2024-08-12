"use client";
import Image from "next/image";

export default function InstructionItem({
  instructionName,
  index,
  handleDeleteInstruction,
}: {
  instructionName: string;
  index: number;
  handleDeleteInstruction: Function;
}) {
  const step = index + 1;
  return (
    <div className="flex items-center text-[15px] pt-2">
      <p>
        Step {step}: {instructionName}
      </p>
      <div className="" onClick={() => handleDeleteInstruction(index)}>
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
