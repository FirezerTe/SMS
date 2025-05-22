import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { Button, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { isArray } from "lodash-es";
import { useCallback, useEffect, useMemo } from "react";
import {
  DividendSetupDto,
  useComputeDividendRateMutation,
} from "../../app/api";
import {
  ApprovalStatus,
  DividendDistributionStatus,
  DividendRateComputationStatus,
} from "../../app/api/enums";
import { formatNumber } from "../common";
import { useAlert } from "../notification";
import { usePermission } from "../../hooks";

interface Props {
  dividendSetup: DividendSetupDto;
}

export const ComputeDividendRateButton = ({ dividendSetup }: Props) => {
  const { showErrorAlert } = useAlert();

  const [
    computeDividendRate,
    { error: computeDividendRateError, reset: resetComputeDividendRate },
  ] = useComputeDividendRateMutation();

  const errors = useMemo(
    () => (computeDividendRateError as any)?.data?.errors,
    [computeDividendRateError]
  );

  const { canCreateOrUpdateDividendSetup } = usePermission();

  useEffect(() => {
    const keys = Object.keys(errors || {});
    if (!keys.length) return;

    keys.forEach((key) => {
      const error = errors[key];
      if (isArray(error)) {
        (error || []).forEach((e) => {
          showErrorAlert(e);
        });
      } else {
        return showErrorAlert(error);
      }
    });
    resetComputeDividendRate();
  }, [errors, resetComputeDividendRate, showErrorAlert]);

  const onComputeDividendRate = useCallback(() => {
    computeDividendRate({
      computeDividendRateCommand: {
        setupID: dividendSetup.id,
      },
    })
      .unwrap()
      .then()
      .catch(() => {});
  }, [computeDividendRate, dividendSetup.id]);

  if (!dividendSetup) {
    return null;
  }

  const { dividendRateComputationStatus, approvalStatus } = dividendSetup;

  if (dividendRateComputationStatus === DividendDistributionStatus.Completed) {
    return <>{formatNumber(dividendSetup.dividendRate, 5)}</>;
  }

  return (
    <>
      <Button
        startIcon={
          dividendRateComputationStatus ===
          DividendDistributionStatus.NotStarted ? (
            <PlayCircleFilledWhiteOutlinedIcon />
          ) : dividendRateComputationStatus ===
            DividendDistributionStatus.CompletedWithError ? (
            <WarningAmberOutlinedIcon />
          ) : (
            <CircularProgress size={12} />
          )
        }
        onClick={onComputeDividendRate}
        size="small"
        variant="outlined"
        sx={{ minWidth: 120 }}
        disabled={
          !canCreateOrUpdateDividendSetup ||
          dividendRateComputationStatus ===
            DividendRateComputationStatus.Computing ||
          approvalStatus === ApprovalStatus.Approved
        }
      >
        {dividendRateComputationStatus === DividendDistributionStatus.NotStarted
          ? "Compute"
          : dividendRateComputationStatus ===
            DividendDistributionStatus.CompletedWithError
          ? "Recompute"
          : "Computing"}
      </Button>
      {dividendRateComputationStatus ===
        DividendDistributionStatus.CompletedWithError && (
        <Typography
          variant="caption"
          sx={{ display: "block" }}
          color="warning.main"
        >
          Completed with error
        </Typography>
      )}
    </>
  );
};
