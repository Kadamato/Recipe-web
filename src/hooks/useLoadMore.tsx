// import { useEffect, useState } from "react";
// import { useInView } from "react-intersection-observer";
// import { useSWRInfinite } from "swr";
// import { TAB_STATUS } from "@/const";

// const loadMoreFetcher = async (url: string) => {
//   try {
//     const resp = await fetch(url);

//     if (resp.ok) {
//       const data = await resp.json();
//       return data;
//     }

//     throw new Error("Error fetching data");
//   } catch (error) {
//     throw new Error(`Error fetching data: ${error}`);
//   }
// };

// export default function useLoadMore(api: string, limit) {
//   const [pageIndex, setPageIndex] = useState(1);
//   const { ref, inView } = useInView();
//   const {
//     data: recipes,
//     size,
//     setSize,
//   } = useSWRInfinite(
//     `${api}&page=${pageIndex + 1}&limit=${limit}`,
//     loadMoreFetcher
//   );

//   useEffect(() => {
//     if (inView) {
//       setPageIndex((prev) => prev + 1);
//       setSize(size + 1);
//       mutate([...(data ?? []), ...(recipes ?? [])]);
//     }
//   }, []);
// }
