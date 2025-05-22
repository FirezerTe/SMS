import BlockIcon from "@mui/icons-material/Block";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import {
  ShareholderBlockDetail,
  ShareholderStatusEnum,
  useBlockShareholderMutation,
  useUnBlockShareholderMutation,
} from "../../../app/api";
import { ShareholderStatus } from "../../../app/api/enums";
import { WorkflowActionDialog } from "../../../components/workflow/WorkflowActionDialog";
import { usePermission } from "../../../hooks";
import { removeEmptyFields } from "../../../utils";
import { BlockShareholderDialog } from "./BlockShareholderDialog";
import { useIsReadonlyCheck } from "./useIsReadonlyCheck";

export const BlockShareholderButton = ({
  id,
  status,
}: {
  id: number;
  status: ShareholderStatusEnum;
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const { isReadonly } = useIsReadonlyCheck();
  const [block, { error: blockError, reset: blockReset }] =
    useBlockShareholderMutation();
  const [unblock, { error: unblockError, reset: unblockReset }] =
    useUnBlockShareholderMutation();
  const permissions = usePermission();

  const onDialogClose = useCallback(() => {
    blockReset();
    unblockReset();
    setShowDialog(false);
  }, [blockReset, unblockReset]);

  const onUnblockSubmit = useCallback(
    async (comment: string) => {
      if (!comment?.trim() || status !== ShareholderStatus.Blocked || !id) {
        return;
      }

      const _comment = comment.trim();

      unblock({
        unBlockShareholderCommand: {
          shareholderId: id,
          description: _comment,
        },
      })
        .unwrap()
        .then(onDialogClose)
        .catch(() => {});
    },
    [id, onDialogClose, status, unblock]
  );

  const onBlockShareholderSubmit = useCallback(
    async (data?: ShareholderBlockDetail) => {
      if (!data) {
        return;
      }
      const { blockedTill, effectiveDate } = data;
      const blockShareholderCommand = removeEmptyFields({
        ...data,
        blockedTill: blockedTill && dayjs(blockedTill).format("YYYY-MM-DD"),
        effectiveDate:
          effectiveDate && dayjs(effectiveDate).format("YYYY-MM-DD"),
      });

      block({
        blockShareholderCommand,
      })
        .unwrap()
        .then(onDialogClose)
        .catch(() => {});
    },
    [block, onDialogClose]
  );

  const errors = useMemo(
    () => ((blockError || unblockError) as any)?.data?.errors,
    [blockError, unblockError]
  );

  return (
    <>
      <Button
        size="large"
        variant="contained"
        color="error"
        startIcon={
          status !== ShareholderStatus.Blocked ? (
            <BlockIcon />
          ) : (
            <SettingsBackupRestoreIcon />
          )
        }
        sx={{ mr: 1 }}
        onClick={() => {
          setShowDialog(true);
        }}
        disabled={!permissions.canCreateOrUpdateShareholderInfo || isReadonly}
      >
        {status !== ShareholderStatus.Blocked ? "BLOCK" : "UNBLOCK"}
      </Button>

      {showDialog && status === ShareholderStatus.Blocked && (
        <WorkflowActionDialog
          title={`${
            status === ShareholderStatus.Blocked ? "Unblock" : "Block"
          } Shareholder`}
          textAreaTitle="Please provide justification"
          emptyTextAreaErrorMsg="Justification is required"
          onSubmit={onUnblockSubmit}
          onClose={onDialogClose}
          errors={errors}
        />
      )}
      {showDialog && status !== ShareholderStatus.Blocked && (
        <BlockShareholderDialog
          onSubmit={onBlockShareholderSubmit}
          onClose={onDialogClose}
          shareholderId={id}
        />
      )}
    </>
  );
};
