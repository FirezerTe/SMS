import AddIcon from "@mui/icons-material/Add";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { PageHeader } from "../../components";
import { usePermission } from "../../hooks";
import { AllocationList } from "./Allocation-list";
import { AllocationDialog } from "./AllocationDialog";
import { AllocationSummary } from "./AllocationSummary";
import { useAllocations } from "./useAllocations";

const Header = ({ text }: { text: string }) => (
  <Typography
    variant="h5"
    sx={{ lineHeight: 2.5, flex: 1, pt: 2, display: "block" }}
    color="textSecondary"
  >
    {text}
  </Typography>
);

export const Allocations = () => {
  const { allocations } = useAllocations();
  const [dialogOpened, setDialogOpened] = useState(false);
  const permissions = usePermission();

  return (
    <Box>
      <PageHeader
        icon={
          <AttachMoneyIcon
            sx={{ fontSize: "inherit", verticalAlign: "middle" }}
          />
        }
        title={"Allocations"}
      />
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flex: 1 }}></Box>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            setDialogOpened(true);
          }}
          disabled={!permissions.canCreateOrUpdateAllocation}
        >
          Add New Allocation
        </Button>
      </Box>
      <AllocationSummary />
      <Grid container rowSpacing={4.5}>
        {allocations?.draft && allocations.draft.length > 0 && (
          <Grid item xs={12}>
            <Box>
              <Header text="Draft" />
              <AllocationList allocations={allocations.draft} />
            </Box>
          </Grid>
        )}

        {allocations?.submitted && allocations.submitted.length > 0 && (
          <Grid item xs={12}>
            <Box>
              <Header text="Approval Requests" />

              <AllocationList allocations={allocations.submitted} />
            </Box>
          </Grid>
        )}

        {allocations?.rejected && allocations.rejected.length > 0 && (
          <Grid item xs={12}>
            <Box>
              <Header text="Rejected" />

              <AllocationList allocations={allocations.rejected} />
            </Box>
          </Grid>
        )}
        {allocations?.approved && allocations.approved.length > 0 && (
          <Grid item xs={12}>
            <Box>
              <Header text="Approved" />
              <AllocationList
                hideWorkflowComment
                allocations={allocations.approved}
              />
            </Box>
          </Grid>
        )}
      </Grid>

      {dialogOpened && (
        <AllocationDialog
          onClose={() => {
            setDialogOpened(false);
          }}
          title="Add Allocation"
        />
      )}
    </Box>
  );
};
