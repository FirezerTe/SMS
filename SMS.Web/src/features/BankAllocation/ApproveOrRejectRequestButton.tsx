import { Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import {
  useApproveBankAllocationMutation,
  useRejectBankAllocationMutation,
} from "../../app/api";
import { WorkflowActionDialog } from "../../components";
import { usePermission } from "../../hooks";
import { removeEmptyFields } from "../../utils";

export const ApproveOrRejectRequestButton = ({ id }: { id: number }) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject">();
  const [approve, { error: approveError, reset: approveReset }] =
    useApproveBankAllocationMutation();
  const [reject, { error: rejectError, reset: rejectReset }] =
    useRejectBankAllocationMutation();

  const { canApproveBankAllocation } = usePermission();

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
            approveBankAllocationCommand: payload,
          })
        : reject({
            rejectBankAllocationCommand: payload,
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
        disabled={!canApproveBankAllocation}
      >
        Approve
      </Button>

      <Button
        onClick={() => {
          setDialogOpened(true);
          setSelectedAction("reject");
        }}
        size="small"
        disabled={!canApproveBankAllocation}
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
