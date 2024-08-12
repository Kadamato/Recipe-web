import { User } from "@/types";
import { validateRequest } from "@/lib/auth/auth";

export default async function verifyOwner(userId: string) {
  const user = (await validateRequest()) as User | null;
  return user?.id === userId;
}
