import LikeModel from "@/models/Like";

export default async function findLikeByRecipeAndOwnerId(
  recipeId: string,
  ownerId: string
): Promise<boolean | null | string> {
  try {
    const like = await LikeModel.findOne({ recipeId, ownerId });
    if (!like) return null;
    return like;
  } catch (error) {
    console.log(error);
    return null;
  }
}
