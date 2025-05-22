import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Divider, Typography } from "@mui/material";
import { Fragment, useMemo, useState } from "react";
import { useGetTransfersByShareholderIdQuery } from "../../../../app/api";
import { ApprovalStatus } from "../../../../app/api/enums";
import { TransferDialog, TransferSummary } from "../../../Transfer";
import { useCurrentShareholderInfo } from "../../useCurrentShareholderInfo";
import { useCurrentShareholderVersionApprovalStatus } from "../useCurrentShareholderVersionApprovalStatus";

export const TransferTab = () => {
  const [showAddTransferDialog, setShowTransferDialog] = useState(false);

  const shareholder = useCurrentShareholderInfo();
  const { approvalStatus } = useCurrentShareholderVersionApprovalStatus();

  const { data: transfers } = useGetTransfersByShareholderIdQuery(
    {
      shareholderId: shareholder?.id || 0,
    },
    { skip: !shareholder?.id }
  );

  const _transfers = useMemo(() => {
    if (!approvalStatus) return [];

    if (approvalStatus !== ApprovalStatus.Approved) return transfers;

    return transfers?.filter(
      (t) => t.approvalStatus === ApprovalStatus.Approved
    );
  }, [approvalStatus, transfers]);

  const canTransfer = true; //TODO: blocked, no approved payment, ....
  return (
    <>
      <Box sx={{ pt: 2 }}>
        <Box sx={{ display: "flex" }}>
          <Typography
            variant="h5"
            sx={{ lineHeight: 2, flex: 1 }}
            color="textSecondary"
          >
            Transfers
          </Typography>
          <Box>
            {!canTransfer ? (
              <Typography
                variant="subtitle2"
                color="warning.main"
                sx={{ py: 2 }}
              >
                Cannot transfer
              </Typography>
            ) : (
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                onClick={() => setShowTransferDialog(true)}
              >
                New Transfer
              </Button>
            )}
          </Box>
        </Box>
        <Box>
          {(_transfers || []).map((t, index) => (
            <Fragment key={t.id}>
              <TransferSummary key={t.id} transfer={t} />

              {index < (_transfers?.length || 0) - 1 && (
                <Divider sx={{ my: 5 }} />
              )}
            </Fragment>
          ))}

          {!_transfers?.length && (
            <Box
              sx={{ display: "flex", justifyContent: "center", pt: 2, pb: 4 }}
            >
              <Typography>No transfer available</Typography>
            </Box>
          )}
        </Box>
      </Box>
      {showAddTransferDialog && canTransfer && (
        <TransferDialog
          fromShareholder={shareholder}
          onClose={() => {
            setShowTransferDialog(false);
          }}
        />
      )}
    </>
  );
};
