import { Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import {
  useApproveAllocationMutation,
  useRejectAllocationMutation,
} from "../../app/api";
import { WorkflowActionDialog } from "../../components";
import { usePermission } from "../../hooks";
import { removeEmptyFields } from "../../utils";

export const ApproveOrRejectRequestButton = ({ id }: { id: number }) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject">();
  const [approve, { error: approveError, reset: approveReset }] =
    useApproveAllocationMutation();
  const [reject, { error: rejectError, reset: rejectReset }] =
    useRejectAllocationMutation();
  const permissions = usePermission();

  const onDialogClose = useCallback(() => {
    approveReset();
    rejectReset();
    setDialogOpened(false);
  }, [approveReset, rejectReset]);

  const handleSubmit = useCallback(
    async (comment: string) => {
      if (!selectedAction) return;

      const payload = removeEmptyFields({
        id,
        comment,
      });
      (selectedAction === "approve"
        ? approve({
            approveAllocationCommand: payload,
          })
        : reject({
            rejectAllocationCommand: payload,
          })
      )
        .unwrap()
        .then(onDialogClose)
        .catch(() => {});
    },
    [approve, id, onDialogClose, reject, selectedAction]
  );

  const errors = useMemo(
    () => ((approveError || rejectError) as any)?.data?.errors,
    [approveError, rejectError]
  );

  return (
    <>
      <Button
        onClick={() => {
          setDialogOpened(true);
          setSelectedAction("approve");
        }}
        size="small"
        disabled={!permissions.canApproveAllocation}
      >
        Approve
      </Button>

      <Button
        onClick={() => {
          setDialogOpened(true);
          setSelectedAction("reject");
        }}
        size="small"
        disabled={!permissions.canApproveAllocation}
      >
        Reject
      </Button>

      {dialogOpened && (
        <WorkflowActionDialog
          title="Approval Request"
          onClose={() => {
            onDialogClose();
            setSelectedAction(undefined);
          }}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </>
  );
};
