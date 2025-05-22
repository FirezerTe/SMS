import BlockIcon from "@mui/icons-material/Block";
import { Alert, AlertTitle, Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import {
  useGetShareholderBlockDetailQuery,
  useGetShareholderInfoQuery,
  useUploadShareholderBlockDocumentMutation,
} from "../../../../app/api";
import { ShareUnit } from "../../../../app/api/enums";
import { DocumentDownload, DocumentUpload } from "../../../../components";
import { usePermission } from "../../../../hooks";
import { formatNumber } from "../../../common";
import { useAlert } from "../../../notification";
import { useBlockReasons } from "../useBlockReason";
import { useBlockTypes } from "../useBlockType";
import { useShareholderIdAndVersion } from "../useShareholderIdAndVersion";

export const ShareholderBlockDetail = () => {
  const { id: shareholderId, version } = useShareholderIdAndVersion();

  const { data: shareholderInfo } = useGetShareholderInfoQuery(
    {
      id: shareholderId,
      version,
    },
    { skip: !shareholderId }
  );

  const { data: blockReason } = useGetShareholderBlockDetailQuery(
    {
      id: shareholderId,
      versionNumber: version || "",
    },
    {
      skip: !shareholderId || !shareholderInfo?.isBlocked,
    }
  );

  const [uploadBlockDocument] = useUploadShareholderBlockDocumentMutation();
  const permissions = usePermission();

  const { getBlockReason } = useBlockReasons();
  const { getBlockType } = useBlockTypes();
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const uploadAttachment = (blockReasonId: number) => async (files: any[]) => {
    if (files?.length) {
      uploadBlockDocument({
        id: blockReasonId,
        body: {
          file: files[0],
        },
      })
        .unwrap()
        .then(() => {
          showSuccessAlert("Document Uploaded");
        })
        .catch(() => {
          showErrorAlert("Error occurred while uploading document");
        });
    }
  };

  if (!blockReason?.id) return null;

  const hasAttachment = !!blockReason.attachments?.length;

  return (
    <Alert
      severity="error"
      icon={<BlockIcon fontSize="inherit" />}
      sx={{ backgroundColor: "#f8d6d6" }}
    >
      <AlertTitle>Blocked</AlertTitle>
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          mt: 1,
          flexDirection: "column",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", gap: 0.2, alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{ width: 100 }}>
            Reason:
          </Typography>
          <Typography variant="body2">{`${
            getBlockReason(blockReason?.blockReasonId)?.name
          }`}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 0.2, alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{ width: 100 }}>
            Type:
          </Typography>
          <Typography variant="body2">{`${
            getBlockType(blockReason?.blockTypeId)?.name
          }`}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 0.2, alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{ width: 100 }}>
            Effective Date:
          </Typography>
          <Typography variant="body2">
            {blockReason?.effectiveDate
              ? dayjs(blockReason.effectiveDate).format("MMMM D, YYYY")
              : " - "}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 0.2, alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{ width: 100 }}>
            Amount:
          </Typography>
          {!!blockReason.amount && (
            <Typography variant="body2">
              {formatNumber(blockReason?.amount)}{" "}
              {blockReason?.unit === ShareUnit.Birr ? "Birr" : "Shares"}
            </Typography>
          )}
          {!blockReason.amount && <Typography variant="body2">-</Typography>}
        </Box>
        <Box sx={{ display: "flex", gap: 0.2, alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{ width: 100 }}>
            Blocked Until:
          </Typography>
          <Typography variant="body2">
            {blockReason?.blockedTill
              ? dayjs(blockReason.blockedTill).format("MMMM D, YYYY")
              : " - "}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 0.2, alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{ width: 100 }}>
            Description
          </Typography>
          <Typography variant="body2">{blockReason?.description}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 0.2 }}>
          <Typography variant="subtitle2" sx={{ width: 100, py: 0.5 }}>
            Attachments
          </Typography>
          <Box>
            <DocumentUpload
              onAdd={uploadAttachment(blockReason.id)}
              label={`Attach ${!hasAttachment ? "" : "Additional "}Document`}
              showIcon={true}
              size="small"
              disabled={!permissions.canCreateOrUpdateShareholderInfo}
            />
            {hasAttachment && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                {blockReason.attachments?.map((attachment, index) => (
                  <DocumentDownload
                    documentId={attachment.documentId!}
                    key={attachment.documentId}
                    label={attachment.fileName || `Attachment ${index + 1}`}
                    showIcon={true}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Alert>
  );
};
