import { Box, Checkbox, Divider, Grid, Typography } from "@mui/material";
import { ReactNode } from "react";
export const RolesAndPermissions = () => (
  <Box>
    <Grid container alignItems="center" justifyContent="center">
      <Grid item xs={12} md={6}>
        <Section>
          <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
              <Centered>
                <Typography>View</Typography>
              </Centered>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Typography>Edit</Typography>
              </Centered>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Typography>Approve</Typography>
              </Centered>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={3}>
              <Typography>Shareholder</Typography>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={3}>
              <Typography>Shareholder</Typography>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={3}>
              <Typography>Shareholder</Typography>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={3}>
              <Typography>Shareholder</Typography>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={3}>
              <Typography>Shareholder</Typography>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={3}>
              <Typography>Shareholder</Typography>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={3}>
              <Centered>
                <Checkbox />
              </Centered>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        </Section>
      </Grid>
      <Grid item xs={12} md={6}></Grid>
    </Grid>
  </Box>
);

const Centered = ({ children }: { children: ReactNode }) => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
    {children}
  </Box>
);

const Section = ({ children }: { children: ReactNode }) => (
  <Box>{children}</Box>
);
