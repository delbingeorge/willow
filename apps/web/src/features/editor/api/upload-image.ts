import { apiFetch } from "@/shared/lib/api-client";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export async function uploadImage(file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiFetch<{ url: string }>("/upload/image", { method: "POST", body });
}

export function pickImageFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ALLOWED_IMAGE_TYPES.join(",");
    input.addEventListener("change", () => resolve(input.files?.[0] ?? null), { once: true });
    input.addEventListener("cancel", () => resolve(null), { once: true });
    input.click();
  });
}

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPEG and PNG images are supported.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `Image is too large (max ${MAX_IMAGE_BYTES / (1024 * 1024)}MB).`;
  }
  return null;
}
