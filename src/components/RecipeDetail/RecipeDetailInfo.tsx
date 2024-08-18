"use client";
import { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { useState, useRef } from "react";
import useSWRMutation from "swr/mutation";
import { useInView } from "react-intersection-observer";
import useSWRInfinite from "swr/infinite";

import { Spinner } from "@nextui-org/react";
import { Card } from "@nextui-org/card";
import { CardBody } from "@nextui-org/card";
import { CardFooter } from "@nextui-org/card";
import { CardHeader } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Dropdown } from "@nextui-org/dropdown";
import { DropdownTrigger } from "@nextui-org/dropdown";
import { DropdownMenu } from "@nextui-org/dropdown";
import { DropdownItem } from "@nextui-org/dropdown";

import CommentForm from "./CommentForm";
import type { Comment, Recipe, User } from "@/types";
import { useEditForm } from "@/context/EditRecipeProvider";
import CommentList from "../CommentList";
import useSaveRecipe from "@/hooks/useSaveRecipe";
import useDeleteRecipe from "@/hooks/useDeleteRecipe";
import { toast } from "react-toastify";
import { formatTime } from "@/lib/helper/formatTime";
import Link from "next/link";

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

const fetcher = async (url: string, { arg }: { arg: { message: string } }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
  return response.json();
};

const fetcherDelete = async (
  url: string,
  { arg }: { arg: { commentId: string; recipeId: string } }
) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
  return response.json();
};
const loadMoreFetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};
export default function RecipeDetailInfo({
  recipe,
  comments,
  owner,
}: {
  recipe: Recipe;
  comments: Comment[];
  owner: User;
}) {
  const recipeOwner = recipe?.owner?.[0];
  const router = useRouter();
  const { handleEditRecipe } = useEditForm();
  const messageRef = useRef<HTMLInputElement>(null);
  const [commentList, setCommentList] = useState<Comment[]>(comments);
  const recipeId = String(recipe?._id) || "";

  const { ref, inView } = useInView();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isSaved, setIsSaved] = useState<boolean>(recipe?.isSaved || false);

  const { trigger, isMutating: messageSending } = useSWRMutation(
    `/api/recipes/${recipe?._id}/comment`,
    fetcher
  );
  const { trigger: deleteComment, isMutating: isDeleting } = useSWRMutation(
    `/api/recipes/${recipeId}/comment/delete`,
    fetcherDelete
  );

  const { deleteRecipe } = useDeleteRecipe(recipe?._id as string);
  const { data, error, size, setSize } = useSWRInfinite(
    () =>
      `/api/recipes/${recipe?.recipeId}/comments?page=${
        pageIndex + 1
      }&limit=20`,
    loadMoreFetcher
  );
  const { saveRecipe, saveError, isSaving } = useSaveRecipe(
    recipe?._id as string
  );

  const handleDeliveryMessage = async (message: string) => {
    try {
      const resp = await trigger({ message });
      const comment = resp?.data;

      if (resp.error) return router.push("/signin");

      setCommentList((prev) => [
        {
          ...comment,
          avatarUrl: owner.avatarUrl,
          owner: owner,
          username: owner.username,
          isOwner: true,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = messageRef.current?.value;
    if (!message) return;
    messageRef.current!.value = "";
    if (messageSending) return;
    await handleDeliveryMessage(message);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (isDeleting) return;
    const resp = await deleteComment({
      commentId,
      recipeId: recipeId,
    });

    setCommentList((prev) =>
      prev.filter((comment) => comment._id !== commentId)
    );
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

  useEffect(() => {
    if (inView) {
      const comments = data?.[0]?.data;

      if (comments && comments.length > 0) {
        setPageIndex((prev) => prev + 1);
        setSize((prev) => prev + 1);
        setCommentList((prev) => [...prev, ...comments]);
      }
    }
  }, [inView, data, setSize]);

  return (
    <Card className="w-full max-w-[560px] rounded-lg lg:w-[385px] mt-2 lg:ml-2 lg:mt-0 lg:h-[85vh] h-auto ">
      <CardHeader className="justify-between pt-4  border-b-1 hidden lg:flex  ">
        <div className="flex gap-4">
          <Avatar radius="full" size="md" src={recipeOwner?.avatarUrl || ""} />
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
      <div className="flex flex-col-reverse lg:flex-col">
        <CardBody className="h-[64vh] max-h-[64vh] overflow-y-scroll pt-0 pb-0">
          <CommentList
            commentList={commentList || []}
            recipeId={recipeId}
            handleDeleteComment={handleDeleteComment}
          />
          <div ref={ref} className="w-full text-center">
            {commentList.length == 0 || commentList.length < 9 ? (
              ""
            ) : (
              <Spinner size="sm" />
            )}
          </div>
        </CardBody>
        <CardFooter className=" lg:flex">
          <CommentForm
            messageRef={messageRef}
            handleSendMessage={handleSendMessage}
            owner={owner}
          />
        </CardFooter>
      </div>
    </Card>
  );
}
