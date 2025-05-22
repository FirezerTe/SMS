import { Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";

export const DateRange = ({
  onChange,
  from: fromDate,
  to: toDate,
  fromLabel = "From Date",
  toLabel = "To Date",
}: {
  from?: Date;
  to?: Date;
  fromLabel?: string;
  toLabel?: string;
  onChange: (args: { from?: Date; to?: Date }) => void;
}) => {
  const [from, setFrom] = useState<Date | null>(fromDate || null);
  const [to, setTo] = useState<Date | null>(toDate || null);

  useEffect(() => {
    onChange({ from: from || undefined, to: to || undefined });
  }, [from, onChange, to]);

  const onFromChange = (value: Date | null) => {
    setFrom(value);
  };

  const onToChange = (value: Date | null) => {
    setTo(value);
  };
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <DatePicker
        label={fromLabel}
        value={from}
        maxDate={to || undefined}
        disableFuture
        onChange={onFromChange}
        sx={{ flex: 1 }}
        slotProps={{ textField: { size: "small" } }}
      />
      <Typography sx={{ px: 2 }}>-</Typography>
      <DatePicker
        label={toLabel}
        value={to}
        minDate={from || undefined}
        disableFuture
        onChange={onToChange}
        sx={{ flex: 1 }}
        slotProps={{ textField: { size: "small" } }}
      />
    </Box>
  );
};
