import { Box, Button, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useMemo } from "react";
import { DividendDecisionDto } from "../../../app/api";
import { formatNumber } from "../../common";
import { useDividendPeriods } from "../useDividendPeriods";

export const DividendPeriodTooltip = ({
  decision,
}: {
  decision: DividendDecisionDto;
}) => {
  const { getDividendPeriod } = useDividendPeriods();

  const {
    dateRangeLabel,
    dividendRateLabel,
    dividendTaxDueDate,
    dividendYearLabel,
    taxRateLabel,
  } = useMemo(() => {
    const dateRangeLabel = `${getDividendPeriod(
      decision.dividend?.dividendSetup?.dividendPeriodId
    )?.startDate.format("MMMM DD, YYYY")}-${getDividendPeriod(
      decision.dividend?.dividendSetup?.dividendPeriodId
    )?.endDate.format("MMMM DD, YYYY")}`;

    const dividendRateLabel = `${formatNumber(
      decision.dividend?.dividendSetup?.dividendRate,
      4
    )}`;

    const taxRateLabel = formatNumber(
      decision.dividend?.dividendSetup?.taxRate,
      4
    );

    const dividendTaxDueDate =
      (decision.dividend?.dividendSetup?.dividendTaxDueDate &&
        dayjs(decision.dividend?.dividendSetup?.dividendTaxDueDate).format(
          "MMMM D, YYYY"
        )) ||
      "";

    const dividendYearLabel =
      getDividendPeriod(decision.dividend?.dividendSetup?.dividendPeriodId)
        ?.year || "";

    return {
      dateRangeLabel,
      dividendRateLabel,
      dividendTaxDueDate,
      dividendYearLabel,
      taxRateLabel,
    };
  }, [
    decision.dividend?.dividendSetup?.dividendPeriodId,
    decision.dividend?.dividendSetup?.dividendRate,
    decision.dividend?.dividendSetup?.dividendTaxDueDate,
    decision.dividend?.dividendSetup?.taxRate,
    getDividendPeriod,
  ]);

  return (
    <Tooltip
      title={
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f5f5f9",
            color: "rgba(0, 0, 0, 0.87)",
            gap: 1,
            p: 2,
          }}
        >
          <Typography variant="caption">{dateRangeLabel}</Typography>
          <Typography variant="caption">
            {`Dividend Rate: `}{" "}
            <Typography variant="caption" sx={{ fontWeight: "bold" }}>
              {dividendRateLabel}
            </Typography>
          </Typography>
          <Typography variant="caption">
            Tax Rate:{" "}
            <Typography variant="caption" sx={{ fontWeight: "bold" }}>
              {taxRateLabel}%
            </Typography>
          </Typography>
          <Typography variant="caption">
            Tax Due Date:{" "}
            <Typography variant="caption" sx={{ fontWeight: "bold" }}>
              {dividendTaxDueDate}
            </Typography>
          </Typography>
        </Box>
      }
    >
      <Button size="small" variant="text">
        {dividendYearLabel}
      </Button>
    </Tooltip>
  );
};
