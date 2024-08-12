import UserModel from "@/models/User";

export default async function followUserById(ownerId: string, userId: string) {
  try {
    const user = await UserModel.findOne({ userId: userId });

    // if (!user) return null;

    const isFollowing = user.followers.includes(ownerId);

    if (isFollowing) {
      user.followers = user.followers.filter(
        (id: string) => id.toString() !== ownerId.toString()
      );
    } else {
      user.followers.push(ownerId);
    }

    await user.save();

    const followers = user.followers.length;

    return followers;
  } catch (error: any) {
    console.log(error);
    // return null;
  }
}
