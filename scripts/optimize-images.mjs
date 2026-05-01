import { readdir, rename } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const imageDir = path.join(process.cwd(), "public", "images");
const files = (await readdir(imageDir)).filter((file) => file.endsWith(".png"));

await Promise.all(
  files.map(async (file) => {
    const input = path.join(imageDir, file);
    const output = path.join(imageDir, `${file}.tmp`);

    await sharp(input)
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true
      })
      .png({
        quality: 100,
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: false
      })
      .toFile(output);

    await rename(output, input);
  })
);

console.log(`Optimized ${files.length} PNG image(s).`);
