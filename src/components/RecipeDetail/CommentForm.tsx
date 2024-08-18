import Image from "next/image";
import { FormEvent } from "react";

import type { User } from "@/types";

export default function CommentForm({
  messageRef,
  handleSendMessage,
  owner,
}: {
  messageRef: React.RefObject<HTMLInputElement>;
  handleSendMessage: (e: FormEvent<HTMLFormElement>) => void;
  owner: User;
}) {
  return (
    <div className="flex items-center w-full">
      <Image
        src={
          owner?.avatarUrl ||
          "https://i.pinimg.com/564x/c2/7e/b7/c27eb77c278f37d9a204bff5a661b83b.jpg"
        }
        alt=""
        width={40}
        height={40}
        className="w-[40px] h-[40px] object-cover rounded-full"
        quality={100}
        priority
        unoptimized={true}
      />

      <form
        className="flex items-center ml-2 w-[calc(100%_-_40px)]"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          placeholder="Write a comment"
          className="w-full   outline-none  text-sm flex "
          name="message"
          ref={messageRef}
        />

        <button type="submit">
          <Image src="/commentBtn.svg" alt="" width={18} height={18} />
        </button>
        {/* <Button
          type="submit"
          className="bg-black text-white rounded-full  w-1/4 h-9 text-[13px] font-medium mt-2"
        >
          Post
        </Button> */}
      </form>
    </div>
  );
}
