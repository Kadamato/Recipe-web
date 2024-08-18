"use client";
import type { User } from "@/types";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { useState } from "react";

import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

export default function UserProfile({
  user: profile,
  ownerId,
}: {
  user: User;
  ownerId: string;
}) {
  const router = useRouter();

  const [isFollowing, setIsFollowing] = useState<boolean>(
    profile?.isFollowing ?? false
  );

  const { data, trigger, isMutating } = useSWRMutation(
    `/api/users/${profile?.userId}/follow`,
    fetcher
  );

  const handleFollow = async () => {
    if (!ownerId) return router.push("/signin");
    setIsFollowing(!isFollowing);
    await trigger();
  };

  return (
    <div className="pb-5 lg:px-12 pt-5 lg:w-[30%] flex flex-col justify-center items-center ">
      <Image
        src={
          profile?.avatarUrl ||
          "https://i.pinimg.com/736x/6f/cf/5b/6fcf5ba1dc677ec23295cb47b8213308.jpg"
        }
        alt=""
        width={160}
        height={160}
        className="rounded-full w-[165px] h-[165px] object-cover"
        priority
        quality={65}
        unoptimized={true}
      />

      <div className="flex items-center text-[22px] font-semibold mt-3 ">
        <div>{profile?.username}</div>

        {profile?.isOwner ? (
          ""
        ) : (
          <Button
            className={`rounded-full ${
              isFollowing ? "bg-zinc-100 text-black" : "bg-black text-white "
            }  ml-12 h-9 font-semibold`}
            onClick={handleFollow}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>
      <div
        className="flex items-center text-[15px] mt-2 font-medium
      "
      >
        <div className="mr-4">
          <span className="mr-1">{data?.followers ?? profile?.follower}</span>
          Followers
        </div>
        <div>
          <span className=" mr-1">{profile?.following}</span> Following
        </div>
      </div>
    </div>
  );
}
