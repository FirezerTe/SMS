import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Errors } from "../Errors";
import { DialogHeader } from "../dialog";

interface WorkflowActionDialogProps {
  title: string;
  textAreaTitle?: string;
  emptyTextAreaErrorMsg?: string;
  onClose: () => void;
  onSubmit: (comment: string) => void;
  errors: any;
  submitting?: boolean;
}
export const WorkflowActionDialog = ({
  onSubmit,
  onClose,
  title,
  textAreaTitle,
  emptyTextAreaErrorMsg,
  errors,
  submitting,
}: WorkflowActionDialogProps) => {
  const [comment, setComment] = useState<string>("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    hasError && comment?.trim() && setHasError(false);
  }, [comment, hasError]);

  const handleSubmit = useCallback(() => {
    const _comment = comment?.trim();
    if (!_comment) {
      setHasError(true);
      return;
    }
    onSubmit(_comment);
  }, [comment, onSubmit]);

  const onCommentChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setComment(event.target.value || "");
    },
    []
  );

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      <DialogHeader title={title} onClose={onClose} />
      <DialogContent dividers={true} sx={{ width: 600 }}>
        {errors && (
          <Box>
            <Errors errors={errors as any} />
          </Box>
        )}
        <Typography sx={{ py: 1 }}>
          {textAreaTitle || "Please provide your comment"}
        </Typography>
        {hasError && (
          <Typography variant="subtitle2" color="error">
            {emptyTextAreaErrorMsg || "Comment is required"}
          </Typography>
        )}

        <TextField
          fullWidth
          multiline
          minRows={5}
          variant="outlined"
          required
          error={hasError}
          value={comment}
          onChange={onCommentChange}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          onClick={() => handleSubmit()}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} /> : undefined}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
