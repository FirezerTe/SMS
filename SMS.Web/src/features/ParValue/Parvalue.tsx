import AddIcon from "@mui/icons-material/Add";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { PageHeader } from "../../components";
import { usePermission } from "../../hooks";
import { ParValueDialog } from "./ParValueDialog";
import { ParValuesList } from "./ParvalueList";
import { useParValue } from "./useParValue";

const Header = ({ text }: { text: string }) => (
  <Typography
    variant="h5"
    sx={{ lineHeight: 2.5, flex: 1, pt: 2, display: "block" }}
    color="textSecondary"
  >
    {text}
  </Typography>
);

export const ParValues = () => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const {
    hasParValue,
    draft,
    currentParValue,
    parValueHistory,
    rejected,
    submitted,
  } = useParValue();

  const permissions = usePermission();

  return (
    <Box>
      <PageHeader
        icon={
          <AttachMoneyIcon
            sx={{ fontSize: "inherit", verticalAlign: "middle" }}
          />
        }
        title={"Par Value"}
      />
      {!hasParValue && (
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flex: 1 }}></Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setDialogOpened(true);
            }}
            disabled={!permissions.canCreateOrUpdateParValue}
          >
            Add New Par Value
          </Button>
        </Box>
      )}
      <Grid container rowSpacing={4.5}>
        {draft.length > 0 && (
          <Grid item xs={12}>
            <Box>
              <Header text="Draft" />
              <Box>
                <ParValuesList hideWorkflowComment items={draft} />
              </Box>
            </Box>
          </Grid>
        )}
        {submitted.length > 0 && (
          <Grid item xs={12}>
            <Box>
              <Header text="Approval Requests" />
              <Box>
                <ParValuesList items={submitted} />
              </Box>
            </Box>
          </Grid>
        )}
        {rejected.length > 0 && !submitted.length && (
          <Grid item xs={12}>
            <Box>
              <Header text="Rejected" />

              <Box>
                <ParValuesList
                  items={rejected}
                  suppressActionColumn={!!draft?.length}
                />
              </Box>
            </Box>
          </Grid>
        )}
        {currentParValue && (
          <Grid item xs={12}>
            <Box>
              <Header text="Current (Approved)" />
              <Box>
                <ParValuesList
                  hideWorkflowComment
                  items={[currentParValue]}
                  suppressActionColumn={
                    !!(draft?.length || submitted?.length || rejected?.length)
                  }
                />
              </Box>
            </Box>
          </Grid>
        )}
        {parValueHistory.length > 0 && (
          <Grid item xs={12}>
            <Box>
              <Header text="History" />

              <Box>
                <ParValuesList
                  items={parValueHistory}
                  suppressActionColumn
                  hideWorkflowComment
                />
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>

      {dialogOpened && (
        <ParValueDialog
          onClose={() => {
            setDialogOpened(false);
          }}
          title="Add New Par Value"
        />
      )}
    </Box>
  );
};
