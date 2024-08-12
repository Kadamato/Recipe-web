import { headers } from "next/headers";

import OwnerRecipeList from "@/components/OwnerRecipeList";
import UserProfile from "@/components/UserProfile";
import { getUserById } from "@/lib/actions/user";
import { UserResponse } from "@/types";
import { validateRequest } from "@/lib/auth/auth";
import { getRecipesForUser } from "@/lib/actions/recipe";

export default async function ProfilePage() {
  const header = headers();
  const path = header.get("x-current-path");
  const userId = path?.split("/")[2];

  const owner = await validateRequest();
  const ownerId = owner?.id ?? "";

  const user = (await getUserById(userId || "")) as UserResponse;
  const recipes = await getRecipesForUser(userId || "");

  if (!user.data) return <div>{user.error}</div>;

  return (
    <div className="flex mt-5">
      <UserProfile user={user.data} />
      <OwnerRecipeList
        userId={userId || ""}
        ownerId={ownerId}
        recipes={recipes?.data || []}
      />
    </div>
  );
}
