import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { Fragment, useCallback, useMemo, useState } from "react";
import { useTaxPendingDecisionsMutation } from "../../app/api";
import {
  ApprovalStatus,
  DividendDistributionStatus,
  DividendRateComputationStatus,
} from "../../app/api/enums";
import { FormattedText } from "../../components";
import { usePermission } from "../../hooks";
import { formatNumber } from "../common";
import { useAlert } from "../notification";
import { ComputeDividendRateButton } from "./ComputeDividendRateButton";
import { DividendSetupDetailDialog } from "./DividendSetupDetailDialog";
import { DividendSetupDialog } from "./DividendSetupDialog";
import { useDividendPeriods } from "./useDividendPeriods";
import { useDividendSetups } from "./useDividendSetups";

export const DividendSetupsList = () => {
  const { dividendSetups } = useDividendSetups();
  const { getDividendPeriod } = useDividendPeriods();
  const [selectedDividendSetupId, setSelectedDividendSetupId] =
    useState<number>();
  const [action, setAction] = useState<"edit" | "viewDetail">();
  const [taxPendingDecisions] = useTaxPendingDecisionsMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const closeDialog = useCallback(() => {
    setSelectedDividendSetupId(undefined);
    setAction(undefined);
  }, []);

  const selectedDividendSetup = useMemo(
    () =>
      (selectedDividendSetupId &&
        dividendSetups.find((d) => d.id === selectedDividendSetupId)) ||
      undefined,
    [dividendSetups, selectedDividendSetupId]
  );

  const { canCreateOrUpdateDividendSetup, canApproveDividendSetup } =
    usePermission();

  const onTaxPendingDecisions = useCallback(
    (setupId?: number) => () => {
      taxPendingDecisions({
        taxPendingDecisionsCommand: {
          setupId,
        },
      })
        .unwrap()
        .then(() => {
          showSuccessAlert("Done");
        })
        .catch(() => {
          showErrorAlert("Error Occurred");
        });
    },
    [showErrorAlert, showSuccessAlert, taxPendingDecisions]
  );

  return (
    <Box>
      <Paper>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Dividend Period</TableCell>
                <TableCell align="right">Declared Amount </TableCell>
                <TableCell align="right">Allocation Added</TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2">
                    Subscription Payments
                  </Typography>
                  <Typography variant="subtitle2">
                    ( Total / Weighted Average )
                  </Typography>{" "}
                </TableCell>
                <TableCell align="right">Dividend Rate</TableCell>
                <TableCell align="right">Dividend Tax Rate</TableCell>
                <TableCell align="left">Dividend Tax Due Date</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(dividendSetups || []).map((setup) => (
                <Fragment key={setup.id}>
                  <TableRow
                    sx={
                      setup.description
                        ? {
                            " > *": { borderBottom: "0 !important" },
                          }
                        : undefined
                    }
                  >
                    <TableCell>
                      <Typography variant="subtitle2">
                        {getDividendPeriod(setup.dividendPeriodId)?.year || ""}
                      </Typography>
                      <Typography variant="caption">
                        {getDividendPeriod(
                          setup.dividendPeriodId
                        )?.startDate.format("MMMM DD, YYYY")}{" "}
                        -{" "}
                        {getDividendPeriod(
                          setup.dividendPeriodId
                        )?.endDate.format("MMMM DD, YYYY")}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ verticalAlign: "top" }}>
                      {formatNumber(setup.declaredAmount, 2)}
                    </TableCell>
                    <TableCell align="right" sx={{ verticalAlign: "top" }}>
                      {formatNumber(setup.additionalAllocationAmount, 2)}
                    </TableCell>
                    <TableCell align="right" sx={{ verticalAlign: "top" }}>
                      {setup.dividendRateComputationStatus ===
                      DividendDistributionStatus.Completed
                        ? `${formatNumber(
                            setup.totalSubscriptionPayments,
                            3
                          )} / ${formatNumber(
                            setup.totalWeightedAverageSubscriptionPayments,
                            3
                          )}`
                        : "-"}
                    </TableCell>
                    <TableCell align="right" sx={{ verticalAlign: "top" }}>
                      <ComputeDividendRateButton dividendSetup={setup} />
                    </TableCell>

                    <TableCell align="right" sx={{ verticalAlign: "top" }}>
                      {`${formatNumber(setup.taxRate, 3)}${
                        setup.taxRate && "%"
                      }`}
                    </TableCell>
                    <TableCell align="left" sx={{ verticalAlign: "top" }}>
                      {(setup.dividendTaxDueDate &&
                        dayjs(setup.dividendTaxDueDate).format(
                          "MMMM D, YYYY"
                        )) ||
                        ""}
                    </TableCell>
                    {/* <TableCell align="center" sx={{ verticalAlign: "top" }}>
                      {formatNumber(setup.declaredAmount, 2)}
                    </TableCell> */}

                    <TableCell align="right" sx={{ verticalAlign: "top" }}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ flex: 1 }}></Box>
                        {setup.approvalStatus !== ApprovalStatus.Approved && (
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedDividendSetupId(setup.id);
                              setAction("edit");
                            }}
                            disabled={
                              !canCreateOrUpdateDividendSetup ||
                              setup.dividendRateComputationStatus ===
                                DividendRateComputationStatus.Computing ||
                              setup.distributionStatus ==
                                DividendDistributionStatus.Started
                            }
                          >
                            Edit
                          </Button>
                        )}
                        {setup.approvalStatus === ApprovalStatus.Approved &&
                          !setup.taxApplied &&
                          !!setup.hasPendingDecision && (
                            <Button
                              size="small"
                              onClick={onTaxPendingDecisions(setup.id)}
                              disabled={!canApproveDividendSetup}
                            >
                              Tax Pending Decisions
                            </Button>
                          )}
                        {setup.distributionStatus !==
                          DividendDistributionStatus.NotStarted && (
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedDividendSetupId(setup.id);
                              setAction("viewDetail");
                            }}
                            disabled={
                              setup.dividendRateComputationStatus ===
                                DividendRateComputationStatus.Computing ||
                              setup.distributionStatus ==
                                DividendDistributionStatus.Started
                            }
                          >
                            View Detail
                            {setup.approvalStatus !== ApprovalStatus.Approved
                              ? " & Approve"
                              : ""}
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                  {!!setup.description && (
                    <TableRow sx={{ borderTopWidth: 0 }}>
                      <TableCell colSpan={5}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="subtitle2"
                            color="text.primary"
                          >
                            Description:
                          </Typography>
                          <FormattedText text={setup.description} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {action === "edit" && selectedDividendSetup && (
        <DividendSetupDialog
          open={true}
          onClose={closeDialog}
          setup={selectedDividendSetup}
        />
      )}
      {action === "viewDetail" && selectedDividendSetup && (
        <DividendSetupDetailDialog
          open={true}
          onClose={closeDialog}
          setup={selectedDividendSetup}
        />
      )}
    </Box>
  );
};
