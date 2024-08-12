import { validateRequest } from "@/lib/auth/auth";
import { User } from "@/types";
import { redirect } from "next/navigation";

export default async function blockUserAccessPage() {
  const user = (await validateRequest()) as User | null;
  if (user) return redirect("/");
}
