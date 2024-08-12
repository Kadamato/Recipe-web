export default function createImageUrl(file: File) {
  return URL.createObjectURL(file);
}
