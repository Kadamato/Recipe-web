import RecipeCardList from "@/components/RecipeCardList";

import { validateRequest } from "@/lib/auth/auth";
import type { User } from "@/types";

export default async function Home() {
  const user = (await validateRequest()) as User;
  const ownerId = user?.id;
  return (
    <div>
      <RecipeCardList ownerId={ownerId ?? ""} />
    </div>
  );
}
