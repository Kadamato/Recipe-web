import Image from "next/image";
import Link from "next/link";

import type { User } from "@/types";

export default function UserCard({ user }: { user: User }) {
  return (
    <div className="flex items-center mb-4">
      <Image
        src={user?.avatarUrl || ""}
        alt="avatar"
        width={100}
        height={100}
        className="rounded-full w-[45px] h-[45px] lg:w-[60px] lg:h-[60px] object-cover"
      />
      <div className="pl-5 text-[15px] lg:text-[18px]">
        <Link href={user?.url || ""} className="font-semibold">
          {user?.username}
        </Link>
        <div className="flex items-center text-[14px] mt-1 lg:text[16px]">
          <div className="mr-1">{user?.follower || 0} Followers •</div>
          <div>{user?.following || 0} Following </div>
        </div>
      </div>
    </div>
  );
}
