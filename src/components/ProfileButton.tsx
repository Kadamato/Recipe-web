"use client";
import Link from "next/link";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Spinner,
} from "@nextui-org/react";

import { useShowRecipeForm } from "@/context/RecipeFormProvider";

import { User } from "@/types";
import useLogout from "@/hooks/useLogout";
import { useEffect } from "react";

export default function ProfileButton({
  profile,
}: {
  profile: User | null;
}): JSX.Element {
  const { handleOpenRecipeForm } = useShowRecipeForm();
  const { data, error, trigger } = useLogout();

  useEffect(() => {
    if (data) window.location.reload();
  }, [data]);

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          name="Jason Hughes"
          size="sm"
          src={
            profile?.avatarUrl ||
            "https://i.pinimg.com/736x/d8/c7/32/d8c7327ff5c95335f42d1442dd526a94.jpg"
          }
        />
      </DropdownTrigger>

      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2" textValue="profile">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{profile?.username}</p>
        </DropdownItem>
        <DropdownItem
          key="create_recipe"
          onClick={handleOpenRecipeForm}
          textValue="create_recipe"
        >
          Create recipe
        </DropdownItem>
        <DropdownItem key="my_profile" textValue="my_profile">
          <Link href={`${profile?.url}`}>My profile</Link>
        </DropdownItem>
        <DropdownItem key="favorite" textValue="favorite">
          Favorite
        </DropdownItem>
        <DropdownItem key="setting" textValue="setting">
          <Link href="/setting/profile">Setting</Link>
        </DropdownItem>
        <DropdownItem key="logout" color="danger" textValue="logout">
          <button
            type="submit"
            className="mr-2"
            onClick={async () => trigger()}
          >
            Logout
          </button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
