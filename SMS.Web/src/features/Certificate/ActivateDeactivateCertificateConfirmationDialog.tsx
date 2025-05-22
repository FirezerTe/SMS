import { useCallback, useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import {
  ActivateCertificateApiArg,
  CertificateDto,
  DeactivateCertificateApiArg,
  useActivateCertificateMutation,
  useDeactivateCertificateMutation,
} from "../../app/api";
import { DialogHeader } from "../../components";
export const ActivateDeactivateCertificate = ({
  certificate,
}: {
  certificate: CertificateDto;
}) => {
  const [showConfirmationDialog, setConfirmationDialog] = useState(false);
  const [deactivate] = useDeactivateCertificateMutation();
  const [activate] = useActivateCertificateMutation();
  const action = useMemo(
    () => (certificate.isActive ? "DEACTIVATE" : "ACTIVATE"),
    [certificate.isActive]
  );

  const onConfirm = useCallback(() => {
    const payload: ActivateCertificateApiArg | DeactivateCertificateApiArg = {
      certificateDto: certificate,
    };

    (certificate.isActive ? deactivate(payload) : activate(payload))
      .unwrap()
      .then(() => {
        setConfirmationDialog(false);
        window.location.reload();
      })
      .catch(() => {});
  }, [activate, deactivate, certificate.id, certificate.isActive]);

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
        <ActivateDeactivateCertificateConfirmationDialog
          certificate={certificate}
          onCancel={() => setConfirmationDialog(false)}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};

const ActivateDeactivateCertificateConfirmationDialog = ({
  certificate,
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  certificate: CertificateDto;
}) => {
  const action = useMemo(
    () => (certificate.isActive ? "DEACTIVATE" : "ACTIVATE"),
    [certificate.isActive]
  );
  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      <DialogHeader title={`${action} Certificate`} onClose={onCancel} />
      <DialogContent dividers={true} sx={{ width: 600 }}>
        <Box sx={{ p: 1 }}>
          <Typography>
            Are you sure you want to{" "}
            <strong>
              {action} certficate ID : {certificate.id} with issued Amount of{" "}
              {`${certificate.paidupAmount} `}
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
