import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { useGetShareholderDividendsQuery } from "../../../../app/api";
import { ShareholderDividends } from "../../../Dividend";
import { useCurrentShareholderInfo } from "../../useCurrentShareholderInfo";

export const DividendTab = () => {
  const shareholder = useCurrentShareholderInfo();

  const { data: shareholderDividends } = useGetShareholderDividendsQuery(
    {
      shareholderId: shareholder?.id || 0,
    },
    { skip: !shareholder?.id }
  );

  const hasDividendRecord = useMemo(
    () =>
      !!shareholderDividends?.approved?.decisions?.length ||
      !!shareholderDividends?.unapproved?.decisions?.length,
    [
      shareholderDividends?.approved?.decisions?.length,
      shareholderDividends?.unapproved?.decisions?.length,
    ]
  );

  return (
    <Box sx={{ pt: 2 }}>
      <Box sx={{ display: "flex" }}>
        <Typography
          variant="h5"
          sx={{ lineHeight: 2, flex: 1 }}
          color="textSecondary"
        >
          Dividends
        </Typography>
      </Box>

      {!hasDividendRecord && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 2, pb: 4 }}>
          <Typography>No dividend record available</Typography>
        </Box>
      )}
      <ShareholderDividends />
    </Box>
  );
};
