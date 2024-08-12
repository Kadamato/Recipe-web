"use client";
import {
  useContext,
  createContext,
  useState,
  useRef,
  useCallback,
  useTransition,
} from "react";
import type { Recipe } from "@/types";

import { updateRecipe } from "@/lib/actions/recipe";

const EditRecipeContext = createContext({
  openEditForm: false,
  handleOpenEditRecipeForm: () => {},
  handleCloseEditRecipeForm: () => {},
  recipe: {} as Recipe,
  recipeNameRef: {} as React.RefObject<HTMLInputElement>,
  ingredientRef: {} as React.RefObject<HTMLInputElement>,
  instructionRef: {} as React.RefObject<HTMLInputElement>,
  tagRef: {} as React.RefObject<HTMLInputElement>,
  breakfastMealRef: {} as React.RefObject<HTMLInputElement>,
  lunchMealRef: {} as React.RefObject<HTMLInputElement>,
  dinnerMealRef: {} as React.RefObject<HTMLInputElement>,
  submitting: false,
  handleFile: () => {},
  handleChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => {},
  handleDeleteImage: (index: number) => {},
  handleAddIngredient: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {},
  handleDeleteIngredient: (index: number) => {},
  handleAddInstruction: () => {},
  handleDeleteInstruction: (index: number) => {},
  handleAddTag: () => {},
  handleDeleteTag: (index: number) => {},
  handleChangeMeal: (e: React.ChangeEvent<HTMLInputElement>) => {},
  handleUpdateRecipe: (form: FormData) => {},
  handleEditRecipe: (recipe: Recipe) => {},
});

export default function EditRecipeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openEditForm, setOpenEditForm] = useState(false);
  const [recipe, setRecipe] = useState<Recipe>({
    name: "",
    ingredients: [],
    instructions: [],
    meal: [],
    tags: [],
    images: [],
  });

  const recipeNameRef = useRef<HTMLInputElement>(null);
  const ingredientRef = useRef<HTMLInputElement>(null);
  const instructionRef = useRef<HTMLInputElement>(null);
  const breakfastMealRef = useRef<HTMLInputElement>(null);
  const lunchMealRef = useRef<HTMLInputElement>(null);
  const dinnerMealRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);

  const [submitting, startTransition] = useTransition();

  const handleFile = () => document.getElementById("file")?.click();

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const focusImage = document.getElementById("imageMain") as HTMLImageElement;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      setRecipe((prev: Recipe) => ({
        ...prev,
        images: Array.isArray(prev.images)
          ? [...prev.images, file as File]
          : [file as File],
      }));

      focusImage.classList.remove("hidden");
      document.getElementById("uploadBtn")?.classList.add("hidden");
    };
  };
  const handleDeleteImage = useCallback(
    (index: number) => {
      const newImages = recipe.images?.filter((_, i) => i !== index);
      setRecipe((prev: Recipe) => ({ ...prev, images: newImages } as Recipe));
    },
    [recipe.images]
  );

  const handleAddIngredient = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const ingredient = ingredientRef.current?.value;
    if (!ingredient) return;

    setRecipe((prev: Recipe) => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), ingredient],
    }));

    ingredientRef.current!.value = "";
  };

  const handleDeleteIngredient = (index: number) => {
    const newIngredients = (recipe.ingredients ?? []).filter(
      (_, i) => i !== index
    );
    setRecipe((prev: Recipe) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  const handleAddInstruction = () => {
    const instruction = instructionRef.current?.value;
    if (!instruction) return;

    setRecipe((prev: Recipe) => ({
      ...prev,
      instructions: [...(prev.instructions || []), instruction],
    }));

    instructionRef.current!.value = "";
  };

  const handleDeleteInstruction = (index: number) => {
    const newInstructions = (recipe.instructions ?? []).filter(
      (_, i) => i !== index
    );
    setRecipe((prev: Recipe) => ({
      ...prev,
      instructions: newInstructions,
    }));
  };

  const handleAddTag = () => {
    const tag = tagRef.current?.value;
    if (!tag) return;

    setRecipe((prev: Recipe) => ({
      ...prev,
      tags: [...(prev.tags || []), tag],
    }));

    tagRef.current!.value = "";
  };

  const handleDeleteTag = (index: number) => {
    const newTags = (recipe.tags ?? []).filter((_, i) => i !== index);
    setRecipe((prev: Recipe) => ({
      ...prev,
      tags: newTags,
    }));
  };

  const handleChangeMeal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setRecipe((prev: Recipe) => ({
        ...prev,
        meal: [...(prev.meal || []), e.target.name],
      }));
    }

    if (!isChecked) {
      const newMeal = (recipe.meal ?? []).filter((m) => m !== e.target.name);
      setRecipe((prev: Recipe) => ({
        ...prev,
        meal: newMeal,
      }));
    }
  };

  const handleUpdateRecipe = async (form: FormData) => {
    const recipeName = recipeNameRef.current?.value;
    if (
      !recipeName ||
      (recipe.ingredients ?? []).length < 1 ||
      (recipe.instructions ?? []).length < 1 ||
      (recipe.meal ?? []).length < 1 ||
      (recipe.images ?? []).length < 1
    )
      return;

    const formData = new FormData();
    formData.append("recipeName", recipeName);
    (recipe.images ?? []).forEach((image) => formData.append("images", image));
    (recipe.ingredients ?? []).forEach((ingredient) =>
      formData.append("ingredient", ingredient)
    );
    (recipe.instructions ?? []).forEach((instruction) =>
      formData.append("instruction", instruction)
    );
    (recipe.tags ?? []).forEach((tag) => formData.append("tag", tag));
    (recipe.meal ?? []).forEach((meal) => formData.append("meal", meal));

    startTransition(async () => {
      const resp = await updateRecipe(
        recipe && recipe._id ? recipe._id.toString() : "",
        formData
      );

      if (resp?.error) {
        console.log(resp?.error);
        return;
      }

      handleCloseEditRecipeForm();
    });
  };

  const handleOpenEditRecipeForm = () => setOpenEditForm(true);

  const handleCloseEditRecipeForm = () => {
    setOpenEditForm(false);
    setRecipe({});
  };

  const handleEditRecipe = async (recipe: Recipe) => {
    const imagesFile = await Promise.all(
      (recipe.images ?? [])?.map(async (image) => {
        const resp = await fetch(image as string);
        const blob = await resp.blob();
        const file = new File(
          [blob],
          new Date().getTime().toString() + ".png",
          { type: blob.type }
        );
        return file;
      })
    );
    handleOpenEditRecipeForm();

    setRecipe({
      ...recipe,
      images: imagesFile,
    });
  };

  const value = {
    openEditForm,
    handleOpenEditRecipeForm,
    handleCloseEditRecipeForm,
    recipe,
    recipeNameRef,
    ingredientRef,
    instructionRef,
    tagRef,
    breakfastMealRef,
    lunchMealRef,
    dinnerMealRef,
    submitting,
    handleFile,
    handleChangeFile,
    handleDeleteImage,
    handleAddIngredient,
    handleDeleteIngredient,
    handleAddInstruction,
    handleDeleteInstruction,
    handleAddTag,
    handleDeleteTag,
    handleChangeMeal,
    handleUpdateRecipe,
    handleEditRecipe,
  };

  return (
    <EditRecipeContext.Provider value={value}>
      {children}
    </EditRecipeContext.Provider>
  );
}

export const useEditForm = () => {
  const context = useContext(EditRecipeContext);
  if (!context) {
    throw new Error("useCreateRecipeForm must be used within a RecipeProvider");
  }
  return context;
};
