import { Typography } from "@mui/material";

export const FormattedText = ({ text }: { text?: string | null }) =>
  !!text && (
    <Typography
      component="span"
      variant="body2"
      color="text.primary"
      sx={{ whiteSpace: "pre-line" }}
    >
      {text}
    </Typography>
  );
