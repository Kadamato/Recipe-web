import useSWRMutation from "swr/mutation";

const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export default function useLikeRecipe(recipeId: string) {
  const { data, trigger, isMutating } = useSWRMutation(
    `/api/recipes/${recipeId}/like`,
    fetcher
  );

  return {
    likeRecipe: trigger,
    isLiking: isMutating,
  };
}
