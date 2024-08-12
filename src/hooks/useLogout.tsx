import useSWRMutation from "swr/mutation";

const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  }).then((r) => r.json());

export default function useLogout() {
  const { data, error, trigger, isMutating } = useSWRMutation(
    "/api/auth/logout",
    fetcher
  );

  return { data, trigger, error, isMutating };
}
