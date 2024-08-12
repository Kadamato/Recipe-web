"use client";

import Image from "next/image";
import React from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Checkbox,
} from "@nextui-org/react";

import RecipeImageItem from "./RecipeImageItem";
import IngredientItem from "./IngredientItem";
import InstructionItem from "./InstructionItem";
import TagItem from "./TagItem";
import createImageUrl from "@/lib/helper/createImageUrl";
import { useEditForm } from "@/context/EditRecipeProvider";

export default function EditRecipeForm() {
  const {
    openEditForm,
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
  } = useEditForm();

  return (
    <Modal
      size="xl"
      isOpen={openEditForm}
      onClose={handleCloseEditRecipeForm}
      className="h-[80vh] "
    >
      <ModalContent>
        <ModalHeader>Create a new recipe</ModalHeader>
        <ModalBody className="pb-5 overflow-y-scroll text-[15px]">
          <form className="flex flex-col" action={handleUpdateRecipe}>
            <div className="rounded-lg border-1  h-[250px] flex items-center justify-center">
              <Button
                className={`bg-black text-white font-medium ${
                  (recipe.images ?? []).length < 1 ? "block" : "hidden"
                }`}
                onClick={handleFile}
                id="uploadBtn"
              >
                Upload file
              </Button>
              <Image
                src={
                  (recipe.images ?? [])?.length > 0
                    ? createImageUrl(recipe.images?.[0] as File)
                    : "/"
                }
                alt="image"
                width={100}
                height={100}
                className={`w-full h-full object-cover rounded-lg ${
                  (recipe.images ?? []).length < 1 && "hidden"
                }`}
                unoptimized={true}
                quality={65}
                id="imageMain"
              />
              <input type="file" hidden onChange={handleChangeFile} id="file" />
            </div>
            <div className="mt-3  mb-5 flex items-start">
              <div
                className={`max-w-[395px] flex items-center   ${
                  (recipe?.images ?? []).length < 3 ? "" : "overflow-x-scroll"
                }`}
              >
                {recipe?.images?.map((image, index) => (
                  <RecipeImageItem
                    key={index}
                    url={createImageUrl(image as File)}
                    index={index}
                    handleDeleteImage={handleDeleteImage}
                  />
                ))}
              </div>
              <div
                className={`w-[110px] h-[110px] rounded-lg border-1  ${
                  (recipe?.images ?? []).length > 0 && "ml-2"
                } flex items-center justify-center cursor-pointer`}
                onClick={handleFile}
              >
                <Image
                  src="/add.svg"
                  width={26}
                  height={26}
                  alt="add"
                  className=""
                />
              </div>
            </div>
            <div className="">
              <label>Recipe name</label>
              <div className="flex items-center mt-2 ">
                <input
                  type="text"
                  ref={recipeNameRef}
                  defaultValue={recipe.name}
                  className=" h-12 text-[15px] mr-2 w-full border-[2px] border-gray-300 rounded-[12px] px-2"
                  placeholder="Enter recipe name"
                />
              </div>
            </div>
            <div className="mt-3">
              <label>Ingredients</label>
              <div className="flex items-center mt-2 ">
                <input
                  type="text"
                  ref={ingredientRef}
                  className=" h-12 text-[15px] mr-2 w-full border-[2px] border-gray-300 rounded-[12px] px-2"
                  placeholder="Enter ingredient"
                />
                <Button
                  className="bg-black text-white h-10 text-sm font-medium"
                  onClick={handleAddIngredient}
                >
                  Add
                </Button>
              </div>
              <div className="px-1">
                {(recipe.ingredients ?? []).map((ingredient, index) => (
                  <IngredientItem
                    key={index}
                    ingredientName={ingredient}
                    index={index}
                    handleDeleteIngredient={handleDeleteIngredient}
                  />
                ))}
              </div>
            </div>
            <div className="mt-3">
              <label>Instructions</label>
              <div className="flex items-center mt-2 ">
                <input
                  type="text"
                  ref={instructionRef}
                  className=" h-12 text-[15px] mr-2 w-full border-[2px] border-gray-300 rounded-[12px] px-2"
                  placeholder="Enter ingredient"
                />
                <Button
                  className="bg-black text-white h-10 text-sm font-medium"
                  onClick={handleAddInstruction}
                >
                  Add
                </Button>
              </div>
              <div className="px-1 ">
                {(recipe.instructions ?? []).map((instruction, index) => (
                  <InstructionItem
                    key={index}
                    instructionName={instruction}
                    index={index}
                    handleDeleteInstruction={handleDeleteInstruction}
                  />
                ))}
              </div>
            </div>
            <div className="mt-3">
              <label>Tags</label>
              <div className="flex items-center mt-2 ">
                <input
                  type="text"
                  className=" h-12 text-[15px] mr-2 w-full border-[2px] border-gray-300 rounded-[12px] px-2"
                  placeholder="Enter tags"
                  ref={tagRef}
                />
                <Button
                  className="bg-black text-white h-10 text-sm font-medium"
                  onClick={handleAddTag}
                >
                  Add
                </Button>
              </div>

              <div className="px-1">
                {(recipe.tags ?? []).map((tag, index) => (
                  <TagItem
                    key={index}
                    tagName={tag}
                    index={index}
                    handleDeleteTag={handleDeleteTag}
                  />
                ))}
              </div>
            </div>
            <div className="mt-3 ">
              <div className="text-md  ">Meal</div>
              <div className="mt-2 flex flex-col">
                <Checkbox
                  ref={breakfastMealRef}
                  size="md"
                  name="breakfast"
                  onChange={handleChangeMeal}
                  isSelected={recipe?.meal?.includes("breakfast") ?? false}
                >
                  Breakfast
                </Checkbox>
                <Checkbox
                  ref={lunchMealRef}
                  size="md"
                  name="lunch"
                  onChange={handleChangeMeal}
                  isSelected={recipe?.meal?.includes("lunch") ?? false}
                >
                  Lunch
                </Checkbox>
                <Checkbox
                  ref={dinnerMealRef}
                  size="md"
                  name="dinner"
                  onChange={handleChangeMeal}
                  isSelected={recipe?.meal?.includes("dinner") ?? false}
                >
                  Dinner
                </Checkbox>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white font-medium rounded-[30px] mt-5 h-12"
              isDisabled={submitting}
            >
              Update recipe
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
