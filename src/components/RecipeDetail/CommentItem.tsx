"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Comment } from "@/types";

import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  Button,
} from "@nextui-org/react";
import useSWRMutation from "swr/mutation";
import { formatTime } from "@/lib/helper/formatTime";

const items = [
  {
    key: "edit",
    label: "Edit recipe",
  },
  {
    key: "delete",
    label: "Delete file",
  },
];

const fetcher = async (
  url: string,
  { arg }: { arg: { message: string; commentId: string; recipeId: string } }
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

export default function CommentItem({
  comment,
  recipeId,
  handleDeleteComment,
}: {
  comment: Comment;
  recipeId: string;
  handleDeleteComment: (commentId: string) => void;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState(comment?.message);

  const { trigger } = useSWRMutation(
    `/api/recipes/${recipeId}/comment/edit`,
    fetcher
  );

  const handleEditComment = () => {
    setIsEdit((prev) => !prev);
  };

  const handleChangeComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendNewComment = async () => {
    const resp = await trigger({
      message: message ?? "",
      commentId: comment?._id || "",
      recipeId: recipeId,
    });

    setIsEdit(false);
  };

  return (
    <div>
      <div className="flex justify-between mt-5">
        <div className="flex gap-4">
          <Avatar radius="full" size="md" src={comment?.avatarUrl} />
          <div className="flex flex-col  gap-1 items-start justify-center">
            <Link
              href={comment?.url || ""}
              className="text-small font-semibold leading-none text-default-600"
            >
              {comment?.username}
            </Link>
            <h5 className="text-small tracking-tight text-default-400">
              {formatTime(comment?.createdAt ?? new Date())}
            </h5>
          </div>
        </div>

        <div className="flex items-center">
          {comment?.isOwner && (
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
                {(item) => (
                  <DropdownItem
                    key={item.key}
                    color={item.key === "delete" ? "danger" : "default"}
                    className={item.key === "delete" ? "text-danger" : ""}
                    onClick={
                      item.key === "edit"
                        ? handleEditComment
                        : item.key === "delete"
                        ? async () =>
                            await handleDeleteComment(comment?._id || "")
                        : undefined
                    }
                  >
                    {item.label}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>

      <div className="mt-3">
        {isEdit ? (
          <div className="flex flex-col ">
            <Input
              type="text"
              variant="underlined"
              className="mb-2"
              value={message}
              onChange={handleChangeComment}
            />
            <div>
              <Button
                className="bg-black text-white rounded-full w-1/4 h-9 text-[13px] font-medium"
                onClick={handleSendNewComment}
              >
                Save
              </Button>
              <Button
                color="default"
                className="rounded-full w-1/4 h-9 text-[13px] font-medium ml-2"
                onClick={handleEditComment}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-[15px] ">{message}</div>
        )}
      </div>
    </div>
  );
}
