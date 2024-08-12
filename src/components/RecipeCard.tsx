"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";

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
import { likeRecipe } from "@/lib/actions/recipe";
import { useEditForm } from "@/context/EditRecipeProvider";

type LikeStatus = {
  isLiked: boolean;
  likes: number;
};

export default function RecipeCard({
  recipe,
  ownerId,
}: {
  recipe: Recipe;
  ownerId: string;
  user?: User;
}) {
  const owner = recipe.owner && (recipe?.owner[0] as User);
  const isOwner: boolean = ownerId === owner?._id;
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

  const [like, setLike] = useState<LikeStatus>({
    isLiked: recipe.isLiked || false,
    likes: recipe.likes || 0,
  });

  const { handleEditRecipe } = useEditForm();

  const handleLike = async () => {
    try {
      setLike((prev: LikeStatus) => ({
        ...prev,
        likes: prev.likes + (prev.isLiked ? -1 : 1),
        isLiked: !prev.isLiked,
      }));
      const response = await likeRecipe(recipe?._id?.toString() || "");
      if (response?.error) {
        console.error("Error liking recipe", response.error);
        return;
      }
    } catch (error) {
      console.error("Error liking recipe", error);
    }
  };

  return (
    <Card className="w-[100%] max-w-[555px] mt-4">
      <CardHeader className="justify-between pt-4">
        <div className="flex gap-4">
          <Avatar radius="full" size="md" src={owner?.avatarUrl} />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {owner?.username}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">3h</h5>
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
                    isOwner || (item.key !== "edit" && item.key !== "delete")
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
                        : undefined
                    }
                  >
                    {item.label}
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
        <div className="h-[360px] mt-4 ">
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
        </div>
      </CardBody>
      <CardFooter className="gap-4 text-[14px]">
        <div className="flex items-center">
          <button onClick={handleLike}>
            {like?.isLiked ? (
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

          <div>{like?.likes}</div>
        </div>

        <Link href={recipe?.url as string} className="flex items-center">
          <Image
            src="/comment.svg"
            alt="comment"
            width={21}
            height={21}
            className="cursor-pointer mr-2"
          />
          <div>50</div>
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
