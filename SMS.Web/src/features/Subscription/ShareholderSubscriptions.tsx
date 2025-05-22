import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { ShareholderSubscriptionDto } from "../../app/api";
import { ApprovalStatus } from "../../app/api/enums";
import { usePermission } from "../../hooks";
import { useParValue } from "../ParValue";
import { SubscriptionPaymentDialog } from "../payment";
import { useCurrentShareholderVersionApprovalStatus } from "../shareholder";
import { ShareholderAllocations } from "./ShareholderAllocations";
import { ShareholderSubscriptionDetailDialog } from "./ShareholderSubscriptionDetailDialog";
import { ShareholderSubscriptionDialog } from "./ShareholderSubscriptionDialog";
import {
  ShareholderSubscriptionsList,
  SubscriptionAction,
} from "./ShareholderSubscriptionsList";
import { useApplicableSubscriptionGroupLookups } from "./useApplicableSubscriptionGroupLookups";

export const ShareholderSubscriptions = () => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const { approvalStatus } = useCurrentShareholderVersionApprovalStatus();
  const permissions = usePermission();

  const [selectedSubscription, setSelectedSubscription] = useState<{
    action: SubscriptionAction;
    subscription: ShareholderSubscriptionDto;
  } | null>(null);
  const { currentParValue } = useParValue();

  const { applicableSubscriptionGroupLookups } =
    useApplicableSubscriptionGroupLookups();

  const onRowSelect = useCallback(
    (action: SubscriptionAction, subscription: ShareholderSubscriptionDto) => {
      setDialogOpened(true);
      setSelectedSubscription({ action, subscription });
    },
    []
  );

  const onClose = useCallback(() => {
    setDialogOpened(false);
    setSelectedSubscription(null);
  }, []);

  return (
    <>
      <Box sx={{ pt: 2 }}>
        <Box sx={{ display: "flex" }}>
          <Typography
            variant="h5"
            sx={{ lineHeight: 2, flex: 1 }}
            color="textSecondary"
          >
            Subscriptions
          </Typography>
          <Box>
            {!applicableSubscriptionGroupLookups?.filter((x) => !x.isInactive)
              ?.length || !currentParValue ? (
              <Typography
                variant="subtitle2"
                color="warning.main"
                sx={{ p: 2 }}
              >
                No active{" "}
                {(!currentParValue && "Par Value") || "Subscription Group"}{" "}
                available
              </Typography>
            ) : (
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                onClick={() => setDialogOpened(true)}
                disabled={!permissions.canCreateOrUpdateSubscription}
              >
                Add New Subscription
              </Button>
            )}
          </Box>
        </Box>
        <ShareholderAllocations />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {approvalStatus !== ApprovalStatus.Approved && (
            <>
              <ShareholderSubscriptionsList
                approvalStatus={ApprovalStatus.Draft}
                onRowSelect={onRowSelect}
              />
              <ShareholderSubscriptionsList
                approvalStatus={ApprovalStatus.Submitted}
                onRowSelect={onRowSelect}
              />
              <ShareholderSubscriptionsList
                approvalStatus={ApprovalStatus.Rejected}
                onRowSelect={onRowSelect}
              />
            </>
          )}

          <ShareholderSubscriptionsList
            approvalStatus={ApprovalStatus.Approved}
            onRowSelect={onRowSelect}
          />
        </Box>
      </Box>
      {dialogOpened && (
        <>
          {!selectedSubscription && (
            <ShareholderSubscriptionDialog
              title="Add New Subscription"
              onClose={onClose}
            />
          )}
          {selectedSubscription && selectedSubscription.action === "edit" && (
            <ShareholderSubscriptionDialog
              title="Edit Subscription"
              subscription={selectedSubscription.subscription}
              onClose={onClose}
            />
          )}
          {selectedSubscription &&
            selectedSubscription.action === "viewDetail" && (
              <ShareholderSubscriptionDetailDialog
                subscription={selectedSubscription.subscription}
                onClose={onClose}
              />
            )}
          {selectedSubscription && selectedSubscription.action === "pay" && (
            <SubscriptionPaymentDialog
              onClose={onClose}
              subscriptionId={selectedSubscription.subscription.id!}
            />
          )}
        </>
      )}
    </>
  );
};
