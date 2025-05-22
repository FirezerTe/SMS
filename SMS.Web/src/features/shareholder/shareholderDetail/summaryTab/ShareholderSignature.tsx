import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Typography,
} from "@mui/material";
import { useCallback, useRef, useState } from "react";
import {
  ShareholderInfo,
  useAddShareholderSignatureMutation,
} from "../../../../app/api";

import { DialogHeader } from "../../../../components";
import { Signature, SignatureHandle } from "../../../../components/signature";
import { usePermission } from "../../../../hooks";
import { getDocumentUrl } from "../../../common";

interface Props {
  shareholder: ShareholderInfo;
}
export const ShareholderSignature = ({ shareholder }: Props) => {
  const [addShareholder, setAddShareholder] = useState(false);
  const [saveSignature] = useAddShareholderSignatureMutation();
  const ref = useRef<SignatureHandle>(null);
  const onClose = useCallback(() => {
    setAddShareholder(false);
  }, []);
  const permissions = usePermission();

  const onSave = useCallback(async () => {
    const file = await ref?.current?.getSignature();
    if (file && shareholder?.id) {
      saveSignature({
        id: shareholder.id,
        body: {
          file,
        },
      });
      onClose();
    }
  }, [onClose, saveSignature, shareholder.id]);

  const onClear = useCallback(() => {
    ref?.current?.clear();
  }, []);

  const title = !shareholder?.signatureId
    ? "Add Signature"
    : "Change Signature";

  return (
    <Box>
      {shareholder?.signatureId && (
        <Paper variant="outlined" sx={{ p: 0.5, borderRadius: 2 }}>
          <Box
            component="img"
            src={getDocumentUrl(shareholder?.signatureId)}
            alt="signature"
            sx={{ width: "100%", height: "auto" }}
          />
        </Paper>
      )}
      <Button
        size="small"
        sx={{ p: 0, minWidth: 0 }}
        onClick={() => {
          setAddShareholder(true);
        }}
        disabled={!permissions.canCreateOrUpdateShareholderInfo}
      >
        {title}
      </Button>
      <Dialog
        scroll={"paper"}
        disableEscapeKeyDown={true}
        maxWidth={"md"}
        open={addShareholder}
      >
        <DialogHeader title={title} onClose={() => setAddShareholder(false)} />
        <DialogContent dividers={true}>
          <Typography variant="caption" color="text.secondary">
            Sign here
          </Typography>
          <Paper variant="outlined" sx={{ p: 0.5, borderRadius: 2 }}>
            <Signature ref={ref} />
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="primary" variant="outlined" onClick={onClear}>
            Clear
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={onSave}
            disabled={!permissions.canCreateOrUpdateShareholderInfo}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
