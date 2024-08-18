"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@nextui-org/card";
import { CardHeader } from "@nextui-org/card";
import { CardBody } from "@nextui-org/card";
import { CardFooter } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Dropdown } from "@nextui-org/dropdown";
import { DropdownTrigger } from "@nextui-org/dropdown";
import { DropdownMenu } from "@nextui-org/dropdown";
import { DropdownItem } from "@nextui-org/dropdown";

import type { Recipe, User } from "@/types";
import { useEditForm } from "@/context/EditRecipeProvider";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import useLikeRecipe from "@/hooks/useLikeRecipe";
import useSaveRecipe from "@/hooks/useSaveRecipe";
import useDeleteRecipe from "@/hooks/useDeleteRecipe";
import { toast } from "react-toastify";
import { formatTime } from "@/lib/helper/formatTime";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  const owner = recipe.owner && (recipe?.owner[0] as User);
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

  const [likes, setLikes] = useState<number>(recipe?.likes || 0);

  const [isLiked, setIsLiked] = useState<boolean>(recipe?.isLiked || false);

  const [isSaved, setIsSaved] = useState<boolean>(recipe?.isSaved || false);

  const { handleEditRecipe } = useEditForm();

  const { likeRecipe, isLiking } = useLikeRecipe(recipe?._id as string);
  const { saveRecipe, saveError, isSaving } = useSaveRecipe(
    recipe?._id as string
  );
  const { deleteRecipe } = useDeleteRecipe(recipe?._id as string);

  const handleLike = async () => {
    setIsLiked((prev) => !prev);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    const resp = await likeRecipe();
    if (resp?.error) return router.push("/signin");
  };

  const handleSaved = async () => {
    if (isSaving) return;
    const resp = await saveRecipe();
    if (!resp) console.log(resp);
    setIsSaved((prev) => !prev);
  };

  const handleDeleteRecipe = async () => {
    const resp = await deleteRecipe();

    if (!resp) toast.error("Delete error");

    toast.success(`${"Recipe deleted"}`);

    //  reload
    window.location.reload();
  };
  return (
    <Card className="w-[100%] max-w-[555px] mt-4">
      <CardHeader className="justify-between pt-4">
        <div className="flex gap-4">
          <Avatar radius="full" size="md" src={owner?.avatarUrl} />
          <div className="flex flex-col gap-1 items-start justify-center">
            <Link
              href={owner?.url || ""}
              className="text-small font-semibold leading-none text-default-600"
            >
              {owner?.username}
            </Link>
            <h5 className="text-small tracking-tight text-default-400">
              {formatTime(recipe?.createdAt || new Date())}
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
      <CardBody className="px-4 py-0 text-md  leading-6">
        <Link
          href={recipe?.url as string}
          className="text-lg font-medium uppercase"
        >
          {recipe?.name}
        </Link>
        <div className="font-medium text-[16px] py-2">INGREDIENTS</div>
        <div className="text-[15px]">
          {recipe?.ingredients?.map((ingredient, index) => (
            <p key={index}>{ingredient}</p>
          ))}
        </div>
        <div className="font-medium text-[16px] py-2">INSTRUCTIONS</div>
        <div className="text-[15px]">
          {recipe?.instructions?.map((instruction, index) => (
            <p key={index}>
              Step {index + 1}: {instruction}
            </p>
          ))}
        </div>
        {recipe?.tags?.map((tag, index) => (
          <div key={index} className="text-blue font-medium text-[15px] pt-2">
            # {tag}
          </div>
        ))}
        <Link href={recipe?.url || ""} className="h-[360px] mt-4 ">
          {recipe?.images?.map((image, index) => (
            <Image
              src={image?.toString() ?? ""}
              alt={image?.toString() ?? ""}
              key={index}
              width={100}
              height={100}
              className="w-full h-full rounded-lg object-cover mb-2"
              priority
              unoptimized={true}
            />
          ))}
        </Link>
      </CardBody>
      <CardFooter className="gap-4 text-[14px]">
        <div className="flex items-center">
          <button onClick={handleLike}>
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
          </button>

          <div>{likes}</div>
        </div>

        <Link href={recipe?.url as string} className="flex items-center">
          <Image
            src="/comment.svg"
            alt="comment"
            width={21}
            height={21}
            className="cursor-pointer mr-2"
          />
          <div>{recipe.comment || 0}</div>
        </Link>

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
