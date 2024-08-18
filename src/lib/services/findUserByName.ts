import UserModel from "@/models/User";
import type { User } from "@/types";

export default async function findUsersByName(
  username: string,
  startIndex: number,
  limit: number
): Promise<User[] | boolean | null> {
  try {
    const users = (await UserModel.aggregate([
      //  aggregate to count following , follwers
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "followers",
          as: "following",
        },
      },
      {
        $match: {
          username: { $regex: new RegExp(username, "i") },
        },
      },
      { $skip: startIndex },
      { $limit: limit },

      {
        $project: {
          username: 1,
          avatarUrl: 1,
          followers: 1,
          following: 1,
          url: 1,
        },
      },
      {
        $addFields: {
          following: { $size: "$following" },
          follower: { $size: "$followers" },
        },
      },
    ])) as User[];

    if (!users) return false;

    console.log(users);

    return users;
  } catch (error) {
    console.log(error);
    return null;
  }
}
