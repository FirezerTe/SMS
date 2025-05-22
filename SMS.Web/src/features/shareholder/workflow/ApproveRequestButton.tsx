import { Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useApproveShareholderMutation } from "../../../app/api";
import { WorkflowActionDialog } from "../../../components/workflow/WorkflowActionDialog";
import { usePermission } from "../../../hooks";

export const ApproveRequestButton = ({ id }: { id: number }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [approve, { error: approveError, reset: approveReset }] =
    useApproveShareholderMutation();
  const permissions = usePermission();

  const onDialogClose = useCallback(() => {
    approveReset();
    setShowDialog(false);
    setSubmitting(false);
  }, [approveReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      setSubmitting(true);
      approve({
        changeWorkflowStatusEntityDto: {
          id,
          note: comment,
        },
      })
        .unwrap()
        .then(onDialogClose)
        .catch(() => {
          setSubmitting(false);
        });
    },
    [approve, id, onDialogClose]
  );

  const errors = useMemo(
    () => (approveError as any)?.data?.errors,
    [approveError]
  );

  return (
    <>
      <Button
        size="large"
        variant="contained"
        sx={{ mr: 1 }}
        onClick={() => {
          setShowDialog(true);
        }}
        disabled={!permissions.canApproveShareholder}
      >
        Approve
      </Button>
      {showDialog && (
        <WorkflowActionDialog
          title="Approve Request"
          textAreaTitle="Please provide your approval justification comment"
          emptyTextAreaErrorMsg="Justification is required"
          onSubmit={handleSubmit}
          onClose={onDialogClose}
          errors={errors}
          submitting={submitting}
        />
      )}
    </>
  );
};
