export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getAttachmentType(type: string, attUrl?: string) {
  const mimeType = type?.toLowerCase() || "";
  const url = attUrl?.toLowerCase() || "";

  if (
    type === "image" ||
    mimeType.startsWith("image/") ||
    /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(url)
  ) {
    return "image";
  }
  if (
    type === "video" ||
    mimeType.startsWith("video/") ||
    /\.(mp4|webm|mov|avi)$/i.test(url)
  ) {
    return "video";
  }
  if (
    type === "audio" ||
    mimeType.startsWith("audio/") ||
    /\.(mp3|wav|ogg|m4a|aac)$/i.test(url)
  ) {
    return "audio";
  }
  return "file";
}

export function getFileExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const ext = pathname.split(".").pop()?.toUpperCase() || "";
    return ext.length <= 5 ? ext : "";
  } catch {
    return "";
  }
}
