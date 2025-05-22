import DownloadIcon from "@mui/icons-material/Download";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import {
  SubscriptionPaymentDto,
  SubscriptionPaymentReceiptDto,
  useDocumentRootPathQuery,
  useLazyDownloadDocumentQuery,
} from "../../app/api";
import { DialogHeader, KeyValuePair } from "../../components";
import { useBranches } from "../Branch";
import { useDistricts } from "../District";
import { formatNumber } from "../common";
import { usePaymentMethods } from "../paymentMethods";

export const SubscriptionPaymentDetailDialog = ({
  onClose,
  payment,
}: {
  subscriptionId: number;
  payment?: SubscriptionPaymentDto;
  onClose: () => void;
}) => {
  const { data: documentRootPath } = useDocumentRootPathQuery();
  const [downloadReceipt] = useLazyDownloadDocumentQuery();
  const { paymentMethods } = usePaymentMethods();
  const { branches } = useBranches();
  const { districts } = useDistricts();

  const paymentDate =
    (payment?.effectiveDate &&
      dayjs(payment.effectiveDate).format("MMMM D, YYYY")) ||
    "";

  const paymentMethod =
    (paymentMethods || []).find((m) => m.value === payment?.paymentMethodEnum)
      ?.name || "";

  const paymentLocation = `${
    (districts || []).find((d) => d.id === payment?.districtId)?.districtName ||
    "-"
  }/${
    (branches || []).find((b) => b.id === payment?.branchId)?.branchName || "-"
  }`;

  const onDownloadReceipt = async (receipt: SubscriptionPaymentReceiptDto) => {
    receipt.documentId && downloadReceipt({ id: receipt.documentId });
  };

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      fullWidth
      maxWidth={"md"}
      open={true}
    >
      <DialogHeader title={"Payment Detail"} onClose={onClose} />
      <DialogContent dividers={true}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <KeyValuePair
            label={"Reference #"}
            value={payment?.originalReferenceNo}
          />
          <KeyValuePair
            label={"Payment Receipt #"}
            value={payment?.paymentReceiptNo}
          />
          <KeyValuePair
            label={"Amount"}
            value={formatNumber(payment?.amount)}
          />
          <KeyValuePair label={"Payment Date"} value={paymentDate} />
          <KeyValuePair label={"Payment Method"} value={paymentMethod} />
          <KeyValuePair
            label={"Location (District/Branch)"}
            value={paymentLocation}
          />
          <KeyValuePair label={"Note"} value={payment?.note} />
          {!!payment?.receipts?.length && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2">Receipts</Typography>
              <Box>
                <List dense>
                  {payment.receipts.map((r, index) => (
                    <ListItem key={r.id} disablePadding>
                      <ListItemButton
                        onClick={() => onDownloadReceipt(r)}
                        disabled={!documentRootPath}
                      >
                        <ListItemIcon>
                          <DownloadIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={r.fileName || `Receipt ${index + 1}`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
