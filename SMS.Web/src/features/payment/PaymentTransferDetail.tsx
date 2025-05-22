import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { SubscriptionPaymentDto, TransferDto } from "../../app/api";

export const PaymentTransferDto = ({
  transfer,
  payment,
}: {
  transfer?: TransferDto;
  payment?: SubscriptionPaymentDto;
}) => {
  const paymentTransfers = useMemo(
    () =>
      (transfer?.transferees || []).reduce((v, c) => {
        const totalPayment = c.payments
          ?.filter((p) => p.paymentId == payment?.id)
          ?.reduce((v, p) => (v += +(p.amount || 0)), 0);
        return [
          ...v,
          {
            shareholderName: c.shareholder?.displayName || "",
            amount: totalPayment || 0,
          },
        ];
      }, [] as Array<{ shareholderName: string; amount: number }>),
    [payment?.id, transfer?.transferees]
  );

  return (
    <Box>
      <Typography variant="subtitle1">Transfers</Typography>
      <Box>{JSON.stringify(paymentTransfers)}</Box>
    </Box>
  );
};
