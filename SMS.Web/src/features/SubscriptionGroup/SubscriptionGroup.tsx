import AddIcon from "@mui/icons-material/Add";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import { Box, Button, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { SubscriptionGroupInfo } from "../../app/api";
import { PageHeader } from "../../components";
import { useAllocations } from "../Allocation";
import { SubscriptionGroupDialog } from "./SubscriptionGroupDialog";
import {
  SubscriptionGroupList,
  SubscriptionGrp,
} from "./SubscriptionGroupList";
import { useSubscriptionGroups } from "./useSubscriptionGroups";

export const SubscriptionGroup = () => {
  const [selectedSubscriptionGroup, setSelectedSubscriptionGroup] =
    useState<SubscriptionGroupInfo>();

  const { subscriptionGroups } = useSubscriptionGroups();
  const { allocations } = useAllocations();

  const groups = useMemo(
    () =>
      (subscriptionGroups || []).map<SubscriptionGrp>((grp) => ({
        ...grp,
        allocationName:
          allocations?.approved?.find((a) => a.id === grp.allocationID)?.name ||
          undefined,
      })),
    [allocations?.approved, subscriptionGroups]
  );

  const hasActiveAllocation = (allocations?.approved || []).some(
    (a) => a.isActive
  );

  return (
    <Box>
      <PageHeader
        icon={
          <GroupWorkIcon
            sx={{ fontSize: "inherit", verticalAlign: "middle" }}
          />
        }
        title={"Subscription Group"}
      />
      <Box sx={{ display: "flex", mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          {!hasActiveAllocation && (
            <Typography variant="subtitle2" color="warning.main" sx={{ py: 2 }}>
              No active approved allocation is available
            </Typography>
          )}
        </Box>
        {hasActiveAllocation && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setSelectedSubscriptionGroup({})}
          >
            Add New Subscription Group
          </Button>
        )}
      </Box>
      {!!groups.length && (
        <SubscriptionGroupList
          subscriptionGroups={groups}
          onSelect={setSelectedSubscriptionGroup}
        />
      )}
      {selectedSubscriptionGroup && (
        <SubscriptionGroupDialog
          open={true}
          onClose={() => {
            setSelectedSubscriptionGroup(undefined);
          }}
          subscriptionGroup={selectedSubscriptionGroup}
        />
      )}
    </Box>
  );
};
