"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { Card } from "@nextui-org/card";
import { CardBody } from "@nextui-org/card";
import { CardFooter } from "@nextui-org/card";
import { CardHeader } from "@nextui-org/react";
import { Avatar } from "@nextui-org/avatar";
import { Dropdown } from "@nextui-org/dropdown";
import { DropdownTrigger } from "@nextui-org/dropdown";
import { DropdownMenu } from "@nextui-org/dropdown";
import { DropdownItem } from "@nextui-org/dropdown";
import { useEditForm } from "@/context/EditRecipeProvider";

import useLikeRecipe from "@/hooks/useLikeRecipe";
import type { Recipe, User } from "@/types";
import useDeleteRecipe from "@/hooks/useDeleteRecipe";

import useSaveRecipe from "@/hooks/useSaveRecipe";
import { formatTime } from "@/lib/helper/formatTime";
const items = [
  {
    key: "edit",
    label: "Edit recipe",
  },
  {
    key: "save",
    label: "Save ",
  },
  {
    key: "delete",
    label: "Delete file",
  },
];
export default function RecipeDetailForm({
  recipe,
  owner,
}: {
  recipe: Recipe;
  owner: User;
}) {
  const router = useRouter();
  const { handleEditRecipe } = useEditForm();
  const recipeOwner = recipe?.owner?.[0];

  const [isLiked, setIsLiked] = useState<boolean>(recipe?.isLiked || false);
  const [likes, setLikes] = useState<number>(recipe?.likes || 0);
  const [isSaved, setIsSaved] = useState<boolean>(recipe?.isSaved || false);

  const { deleteRecipe } = useDeleteRecipe(recipe?._id as string);
  const { likeRecipe } = useLikeRecipe(recipe?._id as string);
  const { saveRecipe, saveError, isSaving } = useSaveRecipe(
    recipe?._id as string
  );

  const handleLike = async () => {
    setIsLiked((prev) => !prev);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    const resp = await likeRecipe();
    if (resp?.error) console.log(resp.error);
  };

  const handleSaved = async () => {
    if (isSaving) return;
    const resp = await saveRecipe();
    if (resp?.error) return router.push("/signin");
    setIsSaved((prev) => !prev);
  };

  const handleDeleteRecipe = async () => {
    console.log("delete");
    const resp = await deleteRecipe();

    if (!resp) toast.error("Delete error");

    toast.success(`${resp?.message || "Recipe deleted"}`);

    //  return home
    router.push("/");
  };

  return (
    <Card className="w-full max-w-[560px] lg:w-[550px] lg:pt-5 h-[90vh] ]">
      <CardHeader className="justify-between  lg:hidden  ">
        <div className="flex gap-4">
          <Avatar radius="full" size="md" src={recipeOwner?.avatarUrl} />
          <div className="flex flex-col gap-1 items-start justify-center">
            <Link
              href={recipeOwner?.url || ""}
              className="text-small font-semibold leading-none text-default-600"
            >
              {recipeOwner?.username}
            </Link>
            <h5 className="text-small tracking-tight text-default-400">
              {formatTime(recipe?.createdAt ?? new Date())}
            </h5>
          </div>
        </div>

        <div className="flex items-center">
          <Dropdown>
            <DropdownTrigger>
              <Image
                src="/more.svg"
                alt="more-icon"
                width={22}
                height={22}
                className="ml-3 cursor-pointer"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Dynamic Actions" items={items}>
              {items
                .filter(
                  (item) =>
                    recipe?.isOwner ||
                    (item.key !== "edit" && item.key !== "delete")
                )
                .map((item) => (
                  <DropdownItem
                    key={item.key}
                    color={item.key === "delete" ? "danger" : "default"}
                    className={item.key === "delete" ? "text-danger" : ""}
                    onClick={
                      item.key === "edit"
                        ? () => {
                            handleEditRecipe(recipe);
                          }
                        : item.key === "save"
                        ? handleSaved
                        : handleDeleteRecipe
                    }
                  >
                    {item.key === "save"
                      ? isSaved
                        ? "Unsave"
                        : "Save"
                      : item.label}
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-md ">
        <div className="text-[20px] font-medium uppercase">{recipe?.name}</div>
        <div className="font-semibold text-lg py-2">INGREDIENTS</div>
        <div>
          {recipe?.ingredients?.map((ingredient, i) => (
            <div key={i}>{ingredient}</div>
          ))}
        </div>
        <div className="font-semibold text-lg py-2">INSTRUCTIONS</div>
        <div>
          {recipe?.instructions?.map((instruction, i) => (
            <div key={i}>{instruction}</div>
          ))}
        </div>
        <div className="text-blue font-medium text-[14px] pt-2">
          {recipe?.tags?.map((tag, i) => (
            <div key={i}>{tag}</div>
          ))}
        </div>

        <div className="mt-3">
          {recipe?.images?.map((image, i) => (
            <Image
              src={(image as string) || ""}
              alt=""
              width={100}
              height={100}
              unoptimized={true}
              priority
              key={i}
              className="w-full h-[350px] object-cover rounded-lg"
            />
          ))}
        </div>
      </CardBody>
      <CardFooter className="gap-4 text-[14px] py-5">
        <div className="flex items-center" onClick={handleLike}>
          {isLiked ? (
            <Image
              src="/favorite-fill.svg"
              alt="favorite"
              width={21}
              height={21}
              className="cursor-pointer mr-2"
            />
          ) : (
            <Image
              src="/favorite.svg"
              alt="favorite"
              width={21}
              height={21}
              className="cursor-pointer mr-2"
            />
          )}
          <div>{likes}</div>
        </div>
        <div className="flex items-center">
          <Image
            src="/comment.svg"
            alt="comment"
            width={21}
            height={21}
            className="cursor-pointer mr-2"
          />
          <div>{recipe.comment || 0} </div>
        </div>
        <div className="flex items-center">
          <Image
            src="/share.svg"
            alt="share"
            width={21}
            height={21}
            className="cursor-pointer mr-2"
          />
        </div>
      </CardFooter>
    </Card>
  );
}
