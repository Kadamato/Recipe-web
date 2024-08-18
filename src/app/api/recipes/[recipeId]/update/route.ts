import { z } from "zod";

import updateRecipeById from "@/lib/services/updateRecipeById";
import { validateRequest } from "@/lib/auth/auth";

import uploadFileToCloudinary from "@/lib/helper/uploadFIleToCloudinary";
import getRecipeIdFromUrlPath from "@/lib/helper/getRecipeIdFromUrlPath";

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
export async function PUT(req: Request) {
  const recipeId = getRecipeIdFromUrlPath(req.url);
  const owner = await validateRequest();
  const ownerId = owner?.id || "";

  const formData = await req.formData();

  console.log(recipeId);
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

  if (!recipeValidate.success)
    return Response.json(
      {
        data: null,
        error: recipeValidate.error.flatten().fieldErrors,
      },
      { status: 400 }
    );

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
      return Response.json({
        data: null,
        error: "Error updating recipe",
      });

    return Response.json(
      {
        data: "Recipe created successfully",
        error: null,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return Response.json(
      {
        data: null,
        error: error,
      },
      {
        status: 500,
      }
    );
  }
}
