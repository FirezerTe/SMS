import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { ShareholderSubscriptionDto } from "../../app/api";
import { DialogHeader, DocumentDownload, KeyValuePair } from "../../components";
import { useBranches } from "../Branch";
import { useDistricts } from "../District";
import { useSubscriptionGroups } from "../SubscriptionGroup";
import { formatNumber } from "../common";
import { useSubscriptionDocuments } from "./useSubscriptionDocuments";

export const ShareholderSubscriptionDetailDialog = ({
  subscription,
  onClose,
}: {
  subscription?: ShareholderSubscriptionDto;
  onClose: () => void;
}) => {
  const { branches } = useBranches();
  const { districts } = useDistricts();
  const { subscriptionGroups } = useSubscriptionGroups();
  const { premiumPaymentReceipt, subscriptionForm } = useSubscriptionDocuments(
    subscription?.shareholderId,
    subscription?.id
  );

  const subscriptionDate =
    (subscription?.subscriptionDate &&
      dayjs(subscription?.subscriptionDate).format("MMMM D, YYYY")) ||
    "";

  const subscriptionLocation = `${
    (districts || []).find((d) => d.id === subscription?.subscriptionDistrictID)
      ?.districtName || "-"
  }/${
    (branches || []).find((b) => b.id === subscription?.subscriptionBranchID)
      ?.branchName || "-"
  }`;

  const subscriptionGroup = subscriptionGroups?.find(
    (g) => g.id === subscription?.subscriptionGroupID
  )?.name;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      fullWidth
      maxWidth={"md"}
      open={true}
    >
      <DialogHeader title={"Subscription Detail"} onClose={onClose} />
      <DialogContent dividers={true}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <KeyValuePair label={"Subscription Form"}>
            {!!subscriptionForm?.documentId && (
              <DocumentDownload
                documentId={subscriptionForm.documentId}
                label={subscriptionForm.fileName || "subscription form"}
              />
            )}
          </KeyValuePair>
          <KeyValuePair label={"Premium Payment Receipt"}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="subtitle2">
                {subscription?.premiumPaymentReceiptNo}
              </Typography>
              <Box sx={{ mt: -0.5 }}>
                {!!premiumPaymentReceipt?.documentId && (
                  <DocumentDownload
                    documentId={premiumPaymentReceipt.documentId}
                    label={premiumPaymentReceipt.fileName || "Receipt"}
                  />
                )}
              </Box>
            </Box>
          </KeyValuePair>
          <KeyValuePair
            label={"Reference #"}
            value={subscription?.subscriptionOriginalReferenceNo}
          />
          <KeyValuePair
            label={"Subscription Amount"}
            value={formatNumber(subscription?.amount)}
          />
          <KeyValuePair
            label={"Subscription payment (Approved)"}
            value={formatNumber(
              subscription?.paymentSummary?.totalApprovedPayments
            )}
          />
          <KeyValuePair
            label={"Subscription payment (Pending Approval)"}
            value={formatNumber(
              subscription?.paymentSummary?.totalPendingApprovalPayments
            )}
          />
          <KeyValuePair label={"Subscription Date"} value={subscriptionDate} />
          <KeyValuePair
            label={"Subscription Group"}
            value={subscriptionGroup}
          />
          <KeyValuePair
            label={"Location (District/Branch)"}
            value={subscriptionLocation}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
