import User from "@/models/User";

export default async function setRecipesByRecipeId(
  userId: string,
  recipeId: String
) {
  try {
    const user = await User.findById(userId);
    if (!user) return null;
    user.recipes.push(recipeId);
    await user.save();

    return user;
  } catch (error) {
    return null;
  }
}
