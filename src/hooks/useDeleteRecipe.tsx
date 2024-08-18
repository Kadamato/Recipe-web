import useSWRMutation from "swr/mutation";

const fetcher = async (url: string) => {
  const resp = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!resp.ok) {
    const error = new Error("An error occurred while deleting the recipe");
    throw error;
  }

  return resp.json();
};

export default function useDeleteRecipe(recipeId: string) {
  const { trigger } = useSWRMutation(
    `/api/recipes/${recipeId}/delete`,
    fetcher
  );

  return {
    deleteRecipe: trigger,
  };
}
