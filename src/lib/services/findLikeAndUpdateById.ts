import LikeModel from "@/models/Like";
import type { Like } from "@/types";

export default async function findLikeAndUpdateById(
  ownerId: string,
  recipeId: string
): Promise<Like | null> {
  try {
    const like = await LikeModel.findOneAndUpdate(
      {
        recipeId,
        ownerId,
      },
      [
        {
          $set: { status: { $not: "$status" } },
        },
      ],
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return like;
  } catch (error) {
    return null;
  }
}
