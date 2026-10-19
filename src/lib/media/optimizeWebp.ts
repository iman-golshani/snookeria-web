/**
 * Optimize an image in the browser before Storage upload.
 * Dimensions are reduced only when necessary and pixels remain correctly
 * oriented by the browser's image decoder.
 */
export async function optimizeImageToWebp(
  original: File,
  options: { maxEdge?: number; quality?: number } = {},
): Promise<File> {
  if (!original.type.startsWith("image/")) {
    throw new Error("لطفاً یک تصویر معتبر انتخاب کنید.");
  }
  const maxEdge = options.maxEdge ?? 1600;
  const quality = options.quality ?? 0.88;
  const objectUrl = URL.createObjectURL(original);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("مرورگر امکان پردازش تصویر را ندارد.");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (result) => result ? resolve(result) : reject(new Error("تبدیل تصویر ناموفق بود.")),
        "image/webp",
        quality,
      ),
    );
    if (blob.type !== "image/webp") {
      throw new Error("مرورگر شما از ذخیره WebP پشتیبانی نمی‌کند.");
    }
    return new File(
      [blob],
      original.name.replace(/\.[^.]+$/, "") + ".webp",
      { type: "image/webp", lastModified: Date.now() },
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
