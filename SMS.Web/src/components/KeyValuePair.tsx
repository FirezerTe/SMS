import { Grid, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

export const KeyValuePair = ({
  label,
  value,
  children,
}: {
  label: string;
  value?: string | number | null;
} & PropsWithChildren) => (
  <Grid container sx={{ py: 0.1 }}>
    <Grid item xs={3}>
      <Typography variant={"body2"}> {label}</Typography>
    </Grid>
    <Grid item xs={9} sx={{ display: "flex", alignItems: "center", px: 1 }}>
      {value && (
        <Typography variant={"subtitle2"} sx={{ mr: 2, flex: 1 }}>
          {value}
        </Typography>
      )}
      {children}
    </Grid>
  </Grid>
);
