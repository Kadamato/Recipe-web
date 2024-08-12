import Image from "next/image";
import Link from "next/link";

import type { User } from "@/types";

export default function UserCard({ user }: { user: User }) {
  return (
    <div className="flex items-center mb-4">
      <Image
        src="https://i.pinimg.com/736x/3f/91/15/3f9115d93e231bca97b295713b3d1c13.jpg"
        alt="avatar"
        width={100}
        height={100}
        className="rounded-full w-[60px] h-[60px] object-cover"
      />
      <div className="pl-5">
        <Link href={user?.url || ""} className="font-semibold">
          {user?.username}
        </Link>
        <div className="flex items-center text-[15px] mt-1">
          <div>{user?.follower} Follower</div>
          <div>Following </div>
        </div>
      </div>
    </div>
  );
}
