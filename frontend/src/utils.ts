export function getFilename(path: string) {
  return path.split("/").slice(-1)[0]
}
