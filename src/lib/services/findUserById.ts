import UserModel from "@/models/User";

import type { User } from "@/types";

export default async function findUserById(userId: string) {
  try {
    // check in followers field of all user model to check following of user
    const user = await UserModel.findOne({ userId });

    if (!user) return false;
    const following = await UserModel.find({
      followers: { $in: [user?._id] },
    }).countDocuments();

    const userRes = {
      username: user.username,
      userId: user.userId,
      follower: user.followers.length,
      _id: user._id,
      following,
      avatarUrl: user.avatarUrl,
      url: user.url,
      bio: user.bio,
    } as User;

    return userRes;
  } catch (error) {
    return false;
  }
}
