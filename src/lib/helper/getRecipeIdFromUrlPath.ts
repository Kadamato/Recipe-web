export default function getRecipeIdFromUrlPath(urlPath: string): string {
  const urlParts = urlPath.split("/");
  return urlParts[urlParts.length - 2];
}
