import fs from "fs";
import path from "path";
import mimeTypes from "mime-types";

export const getAssetDataUrl = async (filePath: string) =>
  getFileDataUrl(path.join(__dirname, `../assets/${filePath}`));

export const getFileDataUrl = async (path: string) => {
  const data = await fs.readFileSync(path, { encoding: "base64" });
  const mimeType = mimeTypes.lookup(path);

  return `data:${mimeType};base64,${data}`;
};
