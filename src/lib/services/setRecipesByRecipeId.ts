import User from "@/models/User";

export default async function setRecipesByRecipeId(
  userId: string,
  recipeId: String
) {
  try {
    const user = await User.findById(userId);
    if (user) {
      user.recipes.push(recipeId);
      await user.save();
    }
  } catch (error) {}
}
