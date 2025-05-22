import { View } from "@react-pdf/renderer";
import { PropsWithChildren } from "react";

export const Content = ({ children }: PropsWithChildren) => (
  <View>{children}</View>
);
