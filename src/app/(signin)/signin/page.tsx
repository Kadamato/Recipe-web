import blockUserAccessPage from "@/lib/helper/blockUserAccessPage";
import { login } from "@/lib/actions/auth";

import Image from "next/image";
import { Button } from "@nextui-org/react";

export default async function SignInPage() {
  await blockUserAccessPage();
  return (
    <form
      action={login}
      className="h-[100vh] flex flex-col items-center pt-10 mr-auto ml-auto"
    >
      <h1 className="text-[24px] mb-5"> Sign in </h1>

      <button
        type="submit"
        className="px-4 flex items-center justify-center text-[16px] bg-white border-2 p-2 rounded-lg  shadow-sm"
      >
        <Image
          src="/google-icon.svg"
          alt="google"
          width={20}
          height={20}
          className="w-[24px] h-[24px] rounded-[20px] object-cover mr-3"
          unoptimized={true}
        />
        <div>Login in with google</div>
      </button>
    </form>
  );
}
