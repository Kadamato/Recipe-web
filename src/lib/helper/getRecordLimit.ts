export default function getRecordLimit(url: string) {
  const urlPath = new URL(url);
  const queryParams = new URLSearchParams(urlPath.search);
  const page = (Number(queryParams.get("page")) as number) || 1;
  const limit = (Number(queryParams.get("limit")) as number) || 30;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;


  return { startIndex, limit };
}
