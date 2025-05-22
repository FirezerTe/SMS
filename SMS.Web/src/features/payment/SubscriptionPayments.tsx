import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { TransferDto, useGetSubscriptionPaymentsQuery } from "../../app/api";
import { SubscriptionPaymentsList } from "./SubscriptionPaymentsList";
import { useCurrentShareholderVersionApprovalStatus } from "../shareholder";
import { ApprovalStatus } from "../../app/api/enums";

const Header = ({ title }: { title: string }) => (
  <Box>
    <Typography
      variant="subtitle2"
      sx={{ lineHeight: 2, flex: 1 }}
      color="textSecondary"
    >
      {title}
    </Typography>
  </Box>
);

export const SubscriptionPayments = ({
  subscriptionId,
  transfer,
}: {
  subscriptionId: number;
  transfer?: TransferDto;
}) => {
  const { data: payments, isLoading } = useGetSubscriptionPaymentsQuery(
    {
      id: subscriptionId,
    },
    { skip: !subscriptionId }
  );

  const { approvalStatus } = useCurrentShareholderVersionApprovalStatus();

  const hasPaymentRecord =
    payments?.draft?.length ||
    payments?.submitted?.length ||
    payments?.rejected?.length ||
    payments?.approved?.length;

  if (isLoading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!isLoading && !hasPaymentRecord) {
    return (
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <Typography>No payment available</Typography>
      </Box>
    );
  }

  return (
    <>
      <Typography
        color="textSecondary"
        variant="h6"
        gutterBottom
        sx={{ mb: 2, px: 3 }}
      >
        Payments
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          pb: 3,
          px: 6,
        }}
      >
        {approvalStatus !== ApprovalStatus.Approved && (
          <>
            {!!payments?.draft?.length && (
              <Box>
                <Header title={"Draft"} />
                <SubscriptionPaymentsList
                  transfer={transfer}
                  payments={payments?.draft || []}
                />
              </Box>
            )}
            {!!payments?.submitted?.length && (
              <Box>
                <Header title={"Pending Approval"} />
                <SubscriptionPaymentsList
                  transfer={transfer}
                  payments={payments?.submitted || []}
                />
              </Box>
            )}
            {!!payments?.rejected?.length && (
              <Box>
                <Header title={"Rejected"} />
                <SubscriptionPaymentsList
                  transfer={transfer}
                  payments={payments?.rejected || []}
                />
              </Box>
            )}
          </>
        )}

        {!!payments?.approved?.length && (
          <Box>
            <Header title={"Approved"} />
            <SubscriptionPaymentsList
              transfer={transfer}
              payments={payments?.approved || []}
            />
          </Box>
        )}
      </Box>
    </>
  );
};
