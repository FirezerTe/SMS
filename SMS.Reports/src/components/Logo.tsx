import { Image } from "@react-pdf/renderer";
import { getAssetDataUrl } from "./utils";

export const Logo = ({ height = 25 }: { height?: number | string }) => (
  <Image
    src={getAssetDataUrl("logo.png")}
    style={{ height, width: "auto", objectFit: "contain" }}
  ></Image>
);
