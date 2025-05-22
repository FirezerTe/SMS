import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import {
  ActivateUserApiArg,
  DeactivateUserApiArg,
  UserDetail,
  useActivateUserMutation,
  useDeactivateUserMutation,
} from "../../../app/api";
import { DialogHeader } from "../../../components";

export const ActivateDeactivateUser = ({ user }: { user: UserDetail }) => {
  const [showConfirmationDialog, setConfirmationDialog] = useState(false);
  const [deactivate] = useDeactivateUserMutation();
  const [activate] = useActivateUserMutation();

  const action = useMemo(
    () => (user.isDeactivated ? "ACTIVATE" : "DEACTIVATE"),
    [user.isDeactivated]
  );

  const onConfirm = useCallback(() => {
    const payload: DeactivateUserApiArg | ActivateUserApiArg = {
      userEmail: {
        email: user.email,
      },
    };

    (user.isDeactivated ? activate(payload) : deactivate(payload))
      .unwrap()
      .then(() => {
        setConfirmationDialog(false);
      })
      .catch(() => {});
  }, [activate, deactivate, user.email, user.isDeactivated]);

  return (
    <>
      <Button
        color="warning"
        variant="contained"
        size="small"
        onClick={() => setConfirmationDialog(true)}
      >
        {action}
      </Button>
      {showConfirmationDialog && (
        <ActivateDeactivateUserConfirmationDialog
          user={user}
          onCancel={() => setConfirmationDialog(false)}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};

const ActivateDeactivateUserConfirmationDialog = ({
  user,
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  user: UserDetail;
}) => {
  const action = useMemo(
    () => (user.isDeactivated ? "ACTIVATE" : "DEACTIVATE"),
    [user.isDeactivated]
  );
  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      <DialogHeader title={`${action} User`} onClose={onCancel} />
      <DialogContent dividers={true} sx={{ width: 600 }}>
        <Box sx={{ p: 1 }}>
          <Typography>
            Are you sure you want to{" "}
            <strong>
              {action} {`${user.firstName} ${user.middleName} ${user.lastName}`}
            </strong>
            ?
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button color="warning" variant="contained" onClick={onConfirm}>
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
