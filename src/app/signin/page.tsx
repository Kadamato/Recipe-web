import blockUserAccessPage from "@/lib/helper/blockUserAccessPage";
import { login } from "@/lib/actions/auth";

export default async function SignInPage() {
  await blockUserAccessPage();
  return (
    <form action={login}>
      <button type="submit" className="bg-black text-white">
        Sign in with google
      </button>
    </form>
  );
}
