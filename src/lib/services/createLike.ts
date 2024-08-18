import LikeModel from "@/models/Like";

import type { Like } from "@/types";

export default async function createLike(like: Like): Promise<Like | null> {
  try {
    const newLike = new LikeModel(like);
    const saveLike = await newLike.save();

    return saveLike;
  } catch (error) {
    console.log(error);
    return null;
  }
}
