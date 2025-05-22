import AddIcon from "@mui/icons-material/Add";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { PageHeader } from "../../components";
import { usePermission } from "../../hooks";
import { BankAllocationDialog } from "./BankAllocationDialog";
import { BankAllocationList } from "./BankAllocationList";
import { useBankAllocation } from "./useBankAllocation";

const Header = ({ text }: { text: string }) => (
  <Typography
    variant="h5"
    sx={{ lineHeight: 2.5, flex: 1, pt: 2, display: "block" }}
    color="textSecondary"
  >
    {text}
  </Typography>
);

export const BankAllocation = () => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const {
    hasBankAllocation,
    draft,
    currentBankAllocation,
    bankAllocationHistory,
    rejected,
    submitted,
  } = useBankAllocation();

  const { canCreateOrUpdateBankAllocation } = usePermission();

  return (
    <Box>
      <PageHeader
        icon={
          <AttachMoneyIcon
            sx={{ fontSize: "inherit", verticalAlign: "middle" }}
          />
        }
        title={"Bank Allocation"}
      />
      {!hasBankAllocation && (
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flex: 1 }}></Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              setDialogOpened(true);
            }}
            disabled={!canCreateOrUpdateBankAllocation}
          >
            Add New Bank Allocation
          </Button>
        </Box>
      )}
      <Grid container rowSpacing={4.5}>
        {draft.length > 0 && (
          <Grid item xs={12}>
            <Box>
              <Header text="Draft" />
              <Box>
                <BankAllocationList hideWorkflowComment items={draft} />
              </Box>
            </Box>
          </Grid>
        )}
        {submitted.length > 0 && (
          <Grid item xs={12}>
            <Box>
              <Header text="Approval Requests" />
              <Box>
                <BankAllocationList items={submitted} />
              </Box>
            </Box>
          </Grid>
        )}
        {rejected.length > 0 && !submitted.length && (
          <Grid item xs={12}>
            <Box>
              <Header text="Rejected" />

              <Box>
                <BankAllocationList
                  items={rejected}
                  suppressActionColumn={!!draft?.length}
                />
              </Box>
            </Box>
          </Grid>
        )}
        {currentBankAllocation && (
          <Grid item xs={12}>
            <Box>
              <Header text="Current (Approved)" />
              <Box>
                <BankAllocationList
                  hideWorkflowComment
                  items={[currentBankAllocation]}
                  suppressActionColumn={
                    !!(draft?.length || submitted?.length || rejected?.length)
                  }
                />
              </Box>
            </Box>
          </Grid>
        )}
        {bankAllocationHistory.length > 0 && (
          <Grid item xs={12}>
            <Box>
              <Header text="History" />

              <Box>
                <BankAllocationList
                  items={bankAllocationHistory}
                  suppressActionColumn
                  hideWorkflowComment
                />
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>

      {dialogOpened && (
        <BankAllocationDialog
          onClose={() => {
            setDialogOpened(false);
          }}
          title="Add New Bank Allocation"
        />
      )}
    </Box>
  );
};
