import LikeModel from "@/models/Like";

export default async function findLikesForRecipeById(recipeId: string) {
  try {
    const likes = await LikeModel.find({
      recipeId: recipeId,
      status: true,
    }).countDocuments();

    if (!likes) return 0;

    return likes;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
