"use server";

import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";

import "../cloudinary";
import { RecipeFormResponse } from "@/types";
import uploadFileToCloudinary from "@/lib/helper/uploadFIleToCloudinary";
import createRecipe from "../services/createRecipe";
import { Recipe } from "@/types";
import getAllRecipeForUser from "../services/findAllRecipesForUser";
import setRecipesByRecipeId from "../services/setRecipesByRecipeId";
import { validateRequest } from "../auth/auth";
import type {
  LikeResponse,
  RecipeDetailResponse,
  RecipeResponse,
  User,
  UsersResponse,
} from "@/types";
import findLikeByRecipeAndOwnerId from "../services/findLikeByRecipeAndOwnerId";
import setLikeRecipe from "../services/setLikeRecipe";
import getAllRecipesForGuest from "../services/getAllRecipesForGuest";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import updateRecipeById from "../services/updateRecipeById";
import findLikeAndUpdateById from "../services/findLikeAndUpdateById";
import findRecipeByName from "../services/findRecipeByName";
import findUsersByName from "../services/findUserByName";
import findRecipesForUserById from "../services/findRecipesForUserById";
import findRecipeById from "../services/findRecipeById";
import { error } from "console";
import createComment from "../services/createComment";
import findRecipesForGuestById from "../services/findRecipesForGuestById";
import findRecipeForGuestById from "../services/findRecipeForGuestById";

const recipeSchema = z.object({
  recipeName: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  tags: z.array(z.string()),
  meal: z.array(z.string()),
  images: z.array(
    z
      .instanceof(File)
      .refine((file: File) => /\.(jpg|jpeg|png|svg)$/i.test(file.name), {
        message: "Must be an image file (jpg, jpeg, png, svg)",
      })
  ),
});

type CreateRecipeResponse = {
  data: string | null;
  error: any;
};

export async function createNewRecipe(
  formData: FormData
): Promise<CreateRecipeResponse> {
  const recipeName = formData.get("recipeName") as string;
  const ingredients = formData.getAll("ingredient") as string[];
  const instructions = formData.getAll("instruction") as string[];
  const tags = formData.getAll("tag") as string[];
  const images = formData.getAll("images") as File[];
  const meal = formData.getAll("meal") as string[];

  const urls: string[] = [];

  const user = (await validateRequest()) as User;
  const userId = user.id as string;

  const recipeValidate = recipeSchema.safeParse({
    recipeName,
    ingredients,
    instructions,
    tags,
    meal,
    images,
  });

  if (!recipeValidate.success) {
    return {
      data: null,
      error: recipeValidate.error.flatten().fieldErrors,
    };
  }

  try {
    for await (const image of images) {
      const { url } = await uploadFileToCloudinary(image);
      urls.push(url);
    }

    const recipeId = uuidv4();
    const url = process.env.BASE_URL + "/recipes/" + recipeId;

    const formatUserId = new Types.ObjectId(userId);

    const newRecipe = await createRecipe({
      recipeId,
      name: recipeName,
      ingredients,
      instructions,
      tags,
      meal,
      images: urls,
      ownerId: formatUserId,
      url,
    });

    const id = newRecipe;

    await setRecipesByRecipeId(userId, id || "");

    return {
      data: "Recipe created successfully",
      error: null,
    };
  } catch (error: any) {
    console.log(error);
    return {
      data: null,
      error: error,
    };
  }
}

export async function deleteRecipe(recipeId: string): Promise<boolean> {
  return true;
}

export async function getRecipeList(): Promise<RecipeResponse> {
  const user = (await validateRequest()) as User;

  //  default

  const startIndex = 0;
  const limit = 45;

  try {
    if (!user) {
      const recipes = (await getAllRecipesForGuest()) as Recipe[];
      return {
        data: recipes,
        error: null,
      };
    }

    const userId = String(user.id);
    const recipes = (await getAllRecipeForUser(
      userId,
      startIndex,
      limit
    )) as Recipe[];

    return {
      data: recipes,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error,
    };
  }
}

export async function likeRecipe(recipeId: string): Promise<LikeResponse> {
  const user = (await validateRequest()) as User;

  if (!user) return redirect("/signin");

  const { id: ownerId } = user;

  let result = {} as LikeResponse;

  const isLiked = await findLikeByRecipeAndOwnerId(recipeId, String(ownerId));

  try {
    const like = await findLikeAndUpdateById(ownerId || "", recipeId);

    if (isLiked == null) {
      return {
        data: null,
        error: "Error liking recipe",
      };
    } else if (isLiked == "NOT_FOUND") {
      if (!like)
        return (result = {
          data: null,
          error: "Error liking recipe",
        });

      const updateLikeForRecipe = await setLikeRecipe(
        recipeId,
        like?._id || ""
      );
      if (!updateLikeForRecipe)
        return {
          data: null,
          error: "Error set like in  recipe",
        };
      result = {
        data: "Recipe liked successfully",
        error: null,
        isLiked: like.status,
      };
    } else {
      if (!like)
        return {
          data: null,
          error: "Error liking recipe",
        };
      result = {
        data: "Recipe liked successfully",
        error: null,
        isLiked: like.status,
      };
    }
    return result;
  } catch (error) {
    return {
      data: null,
      error: error,
    };
  }
}

export async function updateRecipe(
  recipeId: string,
  formData: FormData
): Promise<RecipeFormResponse> {
  const recipeName = formData.get("recipeName") as string;
  const ingredients = formData.getAll("ingredient") as string[];
  const instructions = formData.getAll("instruction") as string[];
  const tags = formData.getAll("tag") as string[];
  const images = formData.getAll("images") as File[];
  const meal = formData.getAll("meal") as string[];

  const urls: string[] = [];

  const user = (await validateRequest()) as User;
  const ownerId = user.id as string;

  const recipeValidate = recipeSchema.safeParse({
    recipeName,
    ingredients,
    instructions,
    tags,
    meal,
    images,
  });

  if (!recipeValidate.success)
    return {
      data: null,
      error: recipeValidate.error.flatten().fieldErrors,
    } as RecipeFormResponse;

  try {
    for await (const image of images) {
      const { url } = await uploadFileToCloudinary(image);
      urls.push(url);
    }

    const data = {
      name: recipeName,
      ingredients,
      instructions,
      tags,
      meal,
      images: urls,
    };

    const updatedRecipe = await updateRecipeById(recipeId, ownerId, data);

    if (!updatedRecipe)
      return {
        data: null,
        error: "Error updating recipe",
      };

    revalidatePath("/");
    return {
      data: "Recipe created successfully",
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error,
    };
  }
}

export async function getRecipeByName(
  name: string
): Promise<Recipe | RecipeResponse> {
  const startIndex = 0;
  const limit = 10;
  try {
    const recipe = (await findRecipeByName(name, startIndex, limit)) as Recipe;

    if (!recipe)
      return {
        data: null,
        error: "Error finding recipe",
      };

    return recipe;
  } catch (error: any) {
    return {
      data: null,
      error: error,
    };
  }
}

export async function getUserByName(name: string): Promise<UsersResponse> {
  const startIndex = 0;
  const limit = 10;
  try {
    const users = (await findUsersByName(name, startIndex, limit)) as User[];

    if (!users)
      return {
        data: null,
        error: "Error finding user",
      };

    return {
      data: users,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error,
    };
  }
}

export async function getRecipesForUser(
  userId: string
): Promise<RecipeResponse> {
  const user = await validateRequest();
  const ownerId = user?.id ?? "";

  // default
  const startIndex = 0;
  const limit = 10;

  if (!user)
    return {
      data: null,
      error: "No user found",
    };

  try {
    const recipes = (await findRecipesForUserById(
      userId,
      ownerId,
      startIndex,
      limit
    )) as Recipe[];

    if (!recipes)
      return {
        data: null,
        error: "cannot find user",
      };

    return {
      data: recipes,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error,
    };
  }
}

export async function getRecipeDetail(
  recipeId: string
): Promise<RecipeDetailResponse> {
  const owner = await validateRequest();
  const ownerId = owner?.id || "";

  if (!owner) {
    try {
      const recipe = await findRecipeForGuestById(recipeId);

      if (!recipe)
        return {
          data: null,
          error: "Error finding recipe",
        };

      return {
        data: recipe,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error,
      };
    }
  } else {
    try {
      const recipe = await findRecipeById(recipeId, ownerId);

      if (!recipe)
        return {
          data: null,
          error: "Error finding recipe",
        };

      return {
        data: recipe,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error,
      };
    }
  }
}

export async function createNewComment(recipeId: string, message: string) {
  const owner = await validateRequest();

  if (!owner) return redirect("/signin");
  try {
    const newComment = await createComment({
      ownerId: owner.id,
      recipeId,
      message,
    });

    if (!newComment)
      return {
        data: null,
        error: "Error creating comment",
      };

    return {
      data: newComment,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error,
    };
  }
}
