import Image from "next/image";
import Link from "next/link";

import ProfileButton from "./ProfileButton";
import { validateRequest } from "@/lib/auth/auth";
import SearchForm from "./SearchForm";

import type { User } from "@/types";

export default async function Header() {
  const profile = (await validateRequest()) as User | null;
  return (
    <div>
      <div className="flex z-50 px-3 bg-white fixed w-full items-center justify-between lg:px-12 py-3  ">
        <div className="flex items-center">
          <Link href="/" prefetch={true} className="h-[32px] flex items-center">
            <Image
              src="/logo.svg"
              alt=""
              width={100}
              height={100}
              priority
              unoptimized={true}
              className="h-[100px]"
            />
          </Link>
        </div>
        <div className="flex items-center pl-3">
          <SearchForm />

          <div className="ml-5">
            {profile ? (
              <ProfileButton profile={profile} />
            ) : (
              <Link href="/signin" className="font-medium block">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="h-[64px]"></div>
    </div>
  );
}
