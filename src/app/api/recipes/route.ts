import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

import { validateRequest } from "@/lib/auth/auth";
import type { Recipe, User } from "@/types";
import getAllRecipeForUser from "@/lib/services/findAllRecipesForUser";
import getAllRecipesForGuest from "@/lib/services/getAllRecipesForGuest";
import getRecordLimit from "@/lib/helper/getRecordLimit";
import { v4 as uuidv4 } from "uuid";
import uploadFileToCloudinary from "@/lib/helper/uploadFIleToCloudinary";
import createRecipe from "@/lib/services/createRecipe";
import { Types } from "mongoose";
import setRecipesByRecipeId from "@/lib/services/setRecipesByRecipeId";

import updateRecipeById from "@/lib/services/updateRecipeById";

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

export async function GET(req: Request) {
  const user = (await validateRequest()) as User;

  const { startIndex, limit } = getRecordLimit(req.url);

  try {
    if (!user) {
      const recipes = (await getAllRecipesForGuest(
        startIndex,
        limit
      )) as Recipe[];
      return Response.json(recipes, {
        status: 200,
      });
    }

    const userId = String(user.id);
    const recipes = (await getAllRecipeForUser(
      userId,
      startIndex,
      limit
    )) as Recipe[];

    return Response.json(recipes, {
      status: 200,
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const owner = await validateRequest();
  const ownerId = owner?.id || "";

  const formData = await req.formData();

  const recipeName = formData.get("recipeName") as string;
  const ingredients = formData.getAll("ingredient") as string[];
  const instructions = formData.getAll("instruction") as string[];
  const tags = formData.getAll("tag") as string[];
  const images = formData.getAll("images") as File[];
  const meal = formData.getAll("meal") as string[];

  const urls: string[] = [];

  const recipeValidate = recipeSchema.safeParse({
    recipeName,
    ingredients,
    instructions,
    tags,
    meal,
    images,
  });

  if (!recipeValidate.success) {
    return Response.json(
      {
        data: null,
        error: recipeValidate.error.flatten().fieldErrors,
      },
      {
        status: 400,
      }
    );
  }

  try {
    for await (const image of images) {
      const { url } = await uploadFileToCloudinary(image);
      urls.push(url);
    }

    const recipeId = uuidv4();
    const url = process.env.BASE_URL + "/recipes/" + recipeId;

    const formatUserId = new Types.ObjectId(ownerId);

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

    const saved = await setRecipesByRecipeId(ownerId, id || "");

    if (!saved)
      return Response.json(
        {
          data: null,
          error: "Error saving recipe",
        },
        {
          status: 500,
        }
      );

    return Response.json(
      {
        data: "Recipe created successfully",
        error: null,
        recipe: newRecipe,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.log(error);
    return Response.json({
      data: null,
      error: error,
    });
  }
}
