import UserModel from "@/models/User";
import type { User } from "@/types";
import { url } from "inspector";
import mongoose from "mongoose";

export default async function findUsersByName(
  username: string
): Promise<User[] | boolean | null> {
  try {
    const users = (await UserModel.aggregate([
      { $match: { username: { $regex: username, $options: "i" } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "followers",
          as: "following",
        },
      },
      {
        $project: {
          following: { $size: "$following" },
          follower: { $size: "$followers" },
          username: 1,
          avatarUrl: 1,
          url: 1,
        },
      },
    ])) as User[];

    if (!users) return false;

    return users;
  } catch (error) {
    return null;
  }
}
