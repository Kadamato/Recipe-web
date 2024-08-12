import LikeModel from "@/models/Like";
export default async function updateLikeStatusByRecipeAndOwnerId(
  recipeId: string,
  ownerId: string,
  status: boolean
): Promise<boolean | null> {
  try {
    const updateLike = await LikeModel.findOneAndUpdate(
      { recipeId, ownerId },
      {
        $set: { status },
      }
    );

    if (!updateLike) return null;
    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
}
