import AddIcon from "@mui/icons-material/Add";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { DividendDistributionStatus } from "../../app/api/enums";
import { PageHeader } from "../../components";
import { usePermission } from "../../hooks";
import { DividendSetupDialog } from "./DividendSetupDialog";
import { DividendSetupsList } from "./DividendSetupsList";
import { useDividendPeriods } from "./useDividendPeriods";
import { useDividendSetups } from "./useDividendSetups";

export const DividendSetup = () => {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const { dividendPeriods } = useDividendPeriods();
  const { dividendSetups, fetched } = useDividendSetups();

  const hadDividendPeriod = (dividendPeriods || []).some(() => true);

  const { canCreateOrUpdateDividendSetup } = usePermission();

  const canAddNewSetup =
    (dividendSetups.length > 0 &&
      dividendSetups[0].distributionStatus ===
        DividendDistributionStatus.Completed) ||
    (fetched && dividendSetups.length === 0);

  return (
    <Box>
      <PageHeader
        icon={
          <GroupWorkIcon
            sx={{ fontSize: "inherit", verticalAlign: "middle" }}
          />
        }
        title={"Dividend Setup"}
      />
      {/* <DividendSummary /> */}

      <Box sx={{ display: "flex", mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          {!hadDividendPeriod && (
            <Typography variant="subtitle2" color="warning.main" sx={{ py: 2 }}>
              No dividend period defined
            </Typography>
          )}
        </Box>
        {hadDividendPeriod && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowDialog(true)}
            disabled={!canCreateOrUpdateDividendSetup || !canAddNewSetup}
          >
            Add New Dividend Setup
          </Button>
        )}
      </Box>

      {!!dividendSetups?.length && <DividendSetupsList />}
      {showDialog && (
        <DividendSetupDialog
          open={true}
          onClose={() => {
            setShowDialog(false);
          }}
        />
      )}
    </Box>
  );
};
