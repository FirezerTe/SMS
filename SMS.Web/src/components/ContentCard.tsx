import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  SxProps,
  Theme,
  useTheme,
} from "@mui/material";
import { PropsWithChildren, forwardRef } from "react";

type Props = {
  title?: string;
  divider?: boolean;
  content?: boolean;
  elevation?: number;
  sx?: SxProps<Theme>;
  contentStyle?: SxProps<Theme>;
  border?: boolean;
  boxShadow?: boolean;
} & PropsWithChildren;

const headerStyle = {
  p: 2.5,
  "& .MuiCardHeader-action": { m: "0px auto", alignSelf: "center" },
};

export const ContentCard = forwardRef<HTMLDivElement, Props>(
  (
    {
      title,
      divider,
      content = true,
      elevation,
      children,
      sx,
      contentStyle = {},
      border,
      boxShadow = false,
    },
    ref
  ) => {
    const theme = useTheme();
    boxShadow = theme.palette.mode === "dark" ? boxShadow || true : boxShadow;
    return (
      <Card
        ref={ref}
        elevation={elevation || 0}
        sx={{
          ...sx,
          border: border ? "1px solid" : "none",
          borderRadius: 2,
          borderColor:
            theme.palette.mode === "dark"
              ? theme.palette.divider
              : theme.palette.grey[300],
          boxShadow:
            elevation ||
            (boxShadow && (!border || theme.palette.mode === "dark"))
              ? theme.shadows[1]
              : "inherit",
          ":hover": {
            boxShadow: elevation || boxShadow ? theme.shadows[1] : "inherit",
          },
          "& pre": {
            m: 0,
            p: "16px !important",
            fontFamily: theme.typography.fontFamily,
            fontSize: "0.75rem",
          },
        }}
      >
        {title && (
          <CardHeader
            sx={headerStyle}
            titleTypographyProps={{ variant: "subtitle1" }}
            title={title}
          />
        )}
        {title && divider && <Divider />}
        {content && <CardContent sx={contentStyle}>{children}</CardContent>}
        {!content && children}
      </Card>
    );
  }
);
