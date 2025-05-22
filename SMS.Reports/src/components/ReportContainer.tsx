import PDF, { Page } from "@react-pdf/renderer";
import { PropsWithChildren } from "react";
import { commonStyles } from "./styles";

interface Props extends PropsWithChildren {
  orientation?: "portrait" | "landscape";

  style?: PDF.Styles;
}

export const ReportContainer = ({
  children,
  orientation = "portrait",
  style,
}: Props) => (
  <Page size="A4" style={style || commonStyles.page} orientation={orientation}>
    {children}
  </Page>
);
