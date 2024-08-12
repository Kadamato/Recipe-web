import UserModel from "@/models/User";
import type { User } from "@/types";
import mongoose from "mongoose";

export default async function findUserByOwnerIdAndUserId(
  ownerId: string,
  userId: string
): Promise<User | null | boolean> {
  try {
    // check in followers field of all user model to check following of user
    const user = await UserModel.findOne({ userId });

    if (!user) return false;
    const following = await UserModel.find({
      followers: { $in: [user?._id] },
    }).countDocuments();

    const isFollowing = user.followers.includes(ownerId);

    const userRes = {
      username: user.username,
      userId: user.userId,
      follower: user.followers.length,
      _id: user._id,
      following,
      avatarUrl: user.avatarUrl,
      url: user.url,
      bio: user.bio,
      isFollowing,
      isOwner: ownerId.toString() === user._id.toString(),
    } as User;

    return userRes;
  } catch (error) {
    console.error("Error finding user and recipes", error);
    return null;
  }
}
