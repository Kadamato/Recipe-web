"use server";

import { validateRequest } from "../auth/auth";
import type { User, UserResponse } from "@/types";
import followUserById from "../services/followUserById";
import { revalidatePath, revalidateTag } from "next/cache";
import findUserById from "../services/findUserById";
import findUserByOwnerIdAndUserId from "../services/findUserByOwnerIdAndUserId";

export async function getUserById(userId: string): Promise<UserResponse> {
  const owner = await validateRequest();
  const ownerId = owner?.id;

  if (!owner) {
    const user = await findUserById(userId);

    if (!user)
      return {
        data: null,
        error: "user not found",
      };

    return {
      data: user,
      error: null,
    };
  }
  const user = (await findUserByOwnerIdAndUserId(
    ownerId || "",
    userId
  )) as User;

  if (!user) {
    return {
      data: null,
      error: "user not found",
    };
  } else {
    return {
      data: user,
      error: null,
    };
  }
}

export async function followUser(userId: string): Promise<UserResponse> {
  const owner = await validateRequest();
  const ownerId = owner?.id ?? "";

  try {
    const isFollowing = await followUserById(ownerId, userId);

    if (!isFollowing) {
      return {
        data: null,
        error: "Error following user",
      };
    }

    revalidatePath(`/users/${userId}`);
    return {
      data: isFollowing,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message,
    };
  }
}
