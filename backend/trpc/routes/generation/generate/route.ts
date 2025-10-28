import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { buildPrompt } from "../prompt";

const inputSchema = z.object({
  image: z.string().min(1),
  mimeType: z.string().min(3),
  pose: z.string().min(1),
  aspectRatio: z.string().min(3),
  negativePrompt: z.string().optional().default(""),
  theme: z.string().min(1),
});

export const generateImageProcedure = publicProcedure
  .input(inputSchema)
  .mutation(async ({ input }) => {
    const { image, mimeType, pose, aspectRatio, negativePrompt, theme } = input;

    try {
      const base64 = image.startsWith("data:")
        ? image.split(",")[1] ?? ""
        : image;

      if (!base64) {
        throw new Error("Invalid image data");
      }

      const prompt = buildPrompt({ pose, aspectRatio, negativePrompt, theme });

      const resp = await fetch("https://toolkit.rork.com/images/edit/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          images: [{ type: "image", image: base64 }],
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Upstream error: ${resp.status} ${text}`);
      }

      const json = (await resp.json()) as {
        image?: { base64Data: string; mimeType: string };
      };

      const out = json.image ?? null;
      if (!out?.base64Data) {
        throw new Error("No image data returned");
      }

      const outMime = out.mimeType || "image/png";
      const dataUri = `data:${outMime};base64,${out.base64Data}`;

      return { status: "success" as const, data: dataUri };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      return { status: "error" as const, data: message };
    }
  });

export default generateImageProcedure;
