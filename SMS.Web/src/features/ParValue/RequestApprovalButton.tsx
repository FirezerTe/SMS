import { Box, Button } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useSubmitParValueForApprovalMutation } from "../../app/api";
import { WorkflowActionDialog } from "../../components";
import { usePermission } from "../../hooks";
import { removeEmptyFields } from "../../utils";

export const RequestApprovalButton = ({ id }: { id: number }) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [submit, { error: submitError, reset: submitReset }] =
    useSubmitParValueForApprovalMutation();
  const permissions = usePermission();

  const onDialogClose = useCallback(() => {
    submitReset();
    setDialogOpened(false);
  }, [submitReset]);

  const handleSubmit = useCallback(
    (comment: string) => {
      submit({
        submitParValueApprovalRequestCommand: removeEmptyFields({
          id,
          comment,
        }),
      })
        .unwrap()
        .then(onDialogClose)
        .catch(() => {});
    },
    [id, onDialogClose, submit]
  );

  const errors = useMemo(
    () => (submitError as any)?.data?.errors,
    [submitError]
  );

  return (
    <Box>
      <Button
        onClick={() => {
          setDialogOpened(true);
        }}
        size="small"
        disabled={!permissions.canCreateOrUpdateParValue}
      >
        Submit for Approval
      </Button>

      {dialogOpened && (
        <WorkflowActionDialog
          title="Submit Approval Request"
          onClose={onDialogClose}
          onSubmit={handleSubmit}
          errors={errors}
        />
      )}
    </Box>
  );
};
