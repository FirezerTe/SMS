import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
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
import { useCallback, useState } from "react";
import { TransferDialog } from ".";
import { TransferDto } from "../../app/api";
import {
  ApprovalStatus,
  ShareholderChangeLogEntityType,
} from "../../app/api/enums";
import { usePermission } from "../../hooks";
import { ApprovalStatusLabel, getChangelogStyle } from "../../utils";
import { formatNumber } from "../common";
import { useShareholderChangeLogs } from "../shareholder/shareholderDetail/shareholderChangeLog";
import { DeleteTransferDialog } from "./DeleteTransferDialog";
import { TransferDocument } from "./TransferDocument";
import { TransferWarningIcon } from "./TransferWarningIcon";

export const TransferSummary = ({ transfer }: { transfer: TransferDto }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const permissions = usePermission();
  const { changeLogs } = useShareholderChangeLogs();

  const getChangeLog = useCallback(
    (transfer?: TransferDto) =>
      changeLogs?.find(
        (c) =>
          c.entityType === ShareholderChangeLogEntityType.Transfer &&
          c.entityId === transfer?.id
      ),
    [changeLogs]
  );

  if (!transfer) return;

  return (
    <Box sx={getChangelogStyle(getChangeLog(transfer))}>
      <Paper sx={{ mb: 2, p: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="body2">
            Approval Status:{" "}
            <Typography component="span" variant="subtitle2">{`${
              ApprovalStatusLabel[transfer.approvalStatus!]
            }`}</Typography>
          </Typography>
          <Typography variant="body2">
            Agreement Signed On:{" "}
            <Typography component="span" variant="subtitle2">
              {(transfer.agreementDate &&
                dayjs(transfer.agreementDate).format("MMMM D, YYYY")) ||
                "-"}
            </Typography>
          </Typography>

          <Typography variant="body2">
            Effective Date:{" "}
            <Typography component="span" variant="subtitle2">
              {(transfer.effectiveDate &&
                dayjs(transfer.effectiveDate).format("MMMM D, YYYY")) ||
                "-"}
            </Typography>
          </Typography>
          <Typography variant="body2">
            Service Charge:{" "}
            <Typography component="span" variant="subtitle2">
              {(transfer.serviceCharge &&
                formatNumber(transfer.serviceCharge)) ||
                "--"}
            </Typography>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>Total to Transfer (ETB)</TableCell>
                    <TableCell>Total Transferred (ETB)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>From</TableCell>
                    <TableCell>
                      {transfer?.fromShareholder?.displayName}
                    </TableCell>
                    <TableCell>{transfer?.totalTransferAmount}</TableCell>
                    <TableCell>{transfer?.totalTransferredAmount}</TableCell>
                  </TableRow>

                  {transfer?.transferees?.map((t, index) => (
                    <TableRow key={t.shareholderId}>
                      <TableCell
                        sx={{
                          maxWidth: "80px",
                          borderBottomWidth:
                            (transfer.transferees || []).length > 0
                              ? 0
                              : undefined,
                        }}
                      >
                        {index === 0 ? "To" : ""}
                      </TableCell>
                      <TableCell sx={{ maxWidth: "150px" }}>
                        {t.shareholder?.displayName}
                      </TableCell>
                      <TableCell sx={{ maxWidth: "100px" }}>
                        {t.amount}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", gap: 1, alignItems: "center" }}
                        >
                          <Typography variant="body2">
                            {t.transferredAmount}
                          </Typography>

                          <TransferWarningIcon transferee={t} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ p: 2, display: "flex", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "baseline" }}>
              <Button
                startIcon={<EditIcon />}
                onClick={() => setShowEditDialog(true)}
                size="small"
              >
                {transfer.approvalStatus !== ApprovalStatus.Approved
                  ? "Edit"
                  : "View Detail"}
              </Button>
            </Box>
            {transfer.approvalStatus !== ApprovalStatus.Approved &&
              permissions.canCreateOrUpdateTransfer && (
                <Box>
                  <Button
                    startIcon={<DeleteForeverIcon />}
                    onClick={() => setShowDeleteDialog(true)}
                    color={"warning"}
                    size="small"
                  >
                    Delete
                  </Button>
                </Box>
              )}
          </Box>
        </Box>
        <TransferDocument transfer={transfer} />
      </Paper>
      {showEditDialog && (
        <TransferDialog
          transfer={transfer}
          onClose={() => setShowEditDialog(false)}
        />
      )}
      {showDeleteDialog && transfer.id && (
        <DeleteTransferDialog
          id={transfer.id}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}
    </Box>
  );
};
