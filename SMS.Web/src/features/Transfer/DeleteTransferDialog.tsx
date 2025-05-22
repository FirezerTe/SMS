import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { useCallback } from "react";
import { useDeleteTransferMutation } from "../../app/api";
import { DialogHeader, Errors } from "../../components";
import { usePermission } from "../../hooks";

export const DeleteTransferDialog = ({
  id,
  onClose,
}: {
  id: number;
  onClose: () => void;
}) => {
  const [deleteTransfer, { error: deleteTransferError }] =
    useDeleteTransferMutation();
  const permissions = usePermission();

  const onDeleteTransfer = useCallback(() => {
    deleteTransfer({ id })
      .unwrap()
      .then(onClose)
      .catch(() => {});
  }, [deleteTransfer, id, onClose]);

  const errors = (deleteTransferError as any)?.data?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      fullWidth
      maxWidth={"md"}
      open={true}
    >
      <DialogHeader title={"Delete Transfer"} onClose={onClose} />
      <DialogContent dividers={true}>
        {errors && (
          <Box sx={{ mb: 2 }}>
            <Errors errors={errors as any} />
          </Box>
        )}
        <Typography>
          Are you sure you want to permanently delete the transfer?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={!permissions.canCreateOrUpdateTransfer}
        >
          No
        </Button>
        <Button
          onClick={onDeleteTransfer}
          color="primary"
          variant="outlined"
          type="submit"
          disabled={!permissions.canCreateOrUpdateTransfer}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
