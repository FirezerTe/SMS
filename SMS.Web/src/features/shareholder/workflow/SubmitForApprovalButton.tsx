import { Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useSubmitForApprovalMutation } from "../../../app/api";
import { WorkflowActionDialog } from "../../../components/workflow/WorkflowActionDialog";
import { usePermission } from "../../../hooks";

export const SubmitForApprovalButton = ({ id }: { id: number }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [submit, { error: submitError, reset: submitReset }] =
    useSubmitForApprovalMutation();
  const permissions = usePermission();

  const onDialogClose = useCallback(() => {
    submitReset();
    setShowDialog(false);
    setSubmitting(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      setSubmitting(true);
      submit({
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
    [submit, id, onDialogClose]
  );

  const errors = useMemo(
    () => (submitError as any)?.data?.errors,
    [submitError]
  );

  return (
    <>
      <Button
        variant="contained"
        size="large"
        color="primary"
        onClick={() => {
          setShowDialog(true);
        }}
        disabled={!permissions.canSubmitShareholderApprovalRequest}
      >
        Submit for Approval
      </Button>
      {showDialog && (
        <WorkflowActionDialog
          title="Submit Approval Request"
          textAreaTitle="Please list of all changes you made"
          emptyTextAreaErrorMsg="Changed items list is required"
          onSubmit={handleSubmit}
          onClose={onDialogClose}
          errors={errors}
          submitting={submitting}
        />
      )}
    </>
  );
};
