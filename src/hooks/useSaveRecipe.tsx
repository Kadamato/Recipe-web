import useSWRMutation from "swr/mutation";

const fetcher = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("An error occurred while fetching the data.");
    }
    return response.json();
  } catch (error: any) {
    return { error: true, message: error.message };
  }
};

export default function useSaveRecipe(recipeId: string) {
  const { trigger, error, isMutating } = useSWRMutation(
    `/api/recipes/${recipeId}/save`,
    fetcher
  );

  return {
    saveRecipe: trigger,
    saveError: error,
    isSaving: isMutating,
  };
}
