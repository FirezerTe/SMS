import { Alert, Box, List, ListItem } from "@mui/material";
import { isArray } from "lodash-es";
import { Fragment } from "react";

export const Errors = ({ errors }: { errors?: { [key: string]: string } }) => (
  <>
    {errors && (
      <Box>
        <Alert severity="error">
          <List dense={true} sx={{ py: 0, mt: 0 }}>
            {Object.keys(errors).map((key) => {
              const error = errors[key];
              if (isArray(error)) {
                return (
                  <Fragment key={key}>
                    {(error || []).map((e, index) => (
                      <ListItem key={`${key}-${index}`}>{e}</ListItem>
                    ))}
                  </Fragment>
                );
              } else {
                return <ListItem key={key}>{error}</ListItem>;
              }
            })}
          </List>
        </Alert>
      </Box>
    )}
  </>
);
