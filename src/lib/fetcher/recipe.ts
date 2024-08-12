export async function getAllRecipeForUserFetcher(
  url: string,
  { arg }: { arg: string }
) {
  try {
    const resp = await fetch(url, {
      method: "GET",
    });

    if (resp.ok) {
      const data = await resp.json();
      return data;
    }

    return {
      data: null,
      error: "Error fetching recipes",
    };
  } catch (error) {
    return {
      data: null,
      error: error,
    };
  }
}
