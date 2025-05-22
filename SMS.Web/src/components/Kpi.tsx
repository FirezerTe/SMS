import { Box, Grid, Typography } from "@mui/material";
import { ContentCard } from "./ContentCard";

interface Props {
  title?: string;
  value?: string | number;
  description?: string;
}
export const Kpi = ({ title, value, description }: Props) => (
  <ContentCard contentStyle={{ p: 2 }} border={true} sx={{ height: "100%" }}>
    {title && (
      <Typography variant="h6" color="textSecondary">
        {title}
      </Typography>
    )}
    {value && (
      <Grid container alignItems="center">
        <Grid item>
          <Typography variant="h5" color="inherit">
            {value}
          </Typography>
        </Grid>
      </Grid>
    )}
    {description && (
      <Box sx={{ pt: 1 }}>
        <Typography variant="caption" color="textSecondary">
          {description}
        </Typography>
      </Box>
    )}
  </ContentCard>
);
