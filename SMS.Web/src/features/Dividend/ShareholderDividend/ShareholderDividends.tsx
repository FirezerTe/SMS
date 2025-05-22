import AttachFileIcon from "@mui/icons-material/AttachFile";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import { Box, Button, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import {
  useAttachDividendDecisionDocumentMutation,
  useGetShareholderDividendsQuery,
} from "../../../app/api";
import { ApprovalStatus, DividendDecisionType } from "../../../app/api/enums";
import { DocumentDownload, DocumentUpload } from "../../../components";
import { usePermission } from "../../../hooks";
import { formatNumber } from "../../common";
import { useAlert } from "../../notification";
import { useCurrentShareholderInfo } from "../../shareholder";
import { DividendActionDialog } from "./DividendActionDialog";
import { ShareholderDividendList } from "./ShareholderDividendList";

export const ShareholderDividends = () => {
  const shareholder = useCurrentShareholderInfo();

  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data: shareholderDividends } = useGetShareholderDividendsQuery(
    {
      shareholderId: shareholder?.id || 0,
    },
    { skip: !shareholder?.id }
  );

  const [attachDecisionDocument] = useAttachDividendDecisionDocumentMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const permissions = usePermission();

  const isDraft = shareholderDividends?.unapproved?.decisions?.some(
    (d) => d.approvalStatus === ApprovalStatus.Draft
  );

  const uploadAttachment = useCallback(
    async (files: any[]) => {
      const ids = (shareholderDividends?.unapproved?.decisions || []).map(
        (x) => x.id || 0
      );
      if (!ids.length) return;

      const recentDividendId = Math.max(...ids);

      if (files?.length) {
        attachDecisionDocument({
          id: recentDividendId,
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
    },
    [
      attachDecisionDocument,
      shareholderDividends?.unapproved?.decisions,
      showErrorAlert,
      showSuccessAlert,
    ]
  );

  const attachment = useMemo(() => {
    const decision = shareholderDividends?.unapproved?.decisions?.find(
      (x) => !!x.attachmentDocumentId
    );
    return (
      decision && {
        documentId: decision.attachmentDocumentId,
        fileName: decision.attachmentDocumentFileName || "Decision Document",
      }
    );
  }, [shareholderDividends?.unapproved?.decisions]);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {!!shareholderDividends?.unapproved?.decisions?.length && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ lineHeight: 2, flex: 1, py: 1 }}
                  color="warning.main"
                >
                  Action Required{" "}
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    component={"span"}
                    sx={{ pl: 1 }}
                  >
                    ({isDraft ? "Draft" : "Submitted"})
                  </Typography>
                </Typography>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Box>
                    {!!attachment?.documentId && (
                      <DocumentDownload
                        documentId={attachment.documentId}
                        label={attachment.fileName}
                      />
                    )}
                  </Box>
                  {shareholderDividends.unapproved.decisions.some(
                    (d) => d.decision !== DividendDecisionType.Pending
                  ) && (
                    <Box>
                      <DocumentUpload
                        label="Attach Decision Document"
                        showIcon={true}
                        onAdd={uploadAttachment}
                        startIcon={<AttachFileIcon />}
                      />
                    </Box>
                  )}
                  {permissions.canCreateOrUpdateTransfer && (
                    <Button
                      startIcon={<PointOfSaleOutlinedIcon />}
                      onClick={() => setShowEditDialog(true)}
                      variant="outlined"
                    >
                      {shareholderDividends.unapproved.decisions.some(
                        (d) => d.decision !== DividendDecisionType.Pending
                      )
                        ? "Review Action"
                        : "Take Action"}
                    </Button>
                  )}
                </Box>
              </Box>
              {shareholderDividends.unapproved.decisions.some(
                (d) => d.decision !== DividendDecisionType.Pending
              ) && (
                <Box sx={{ display: "flex", justifyContent: "end", pt: 2 }}>
                  <Typography align="right" variant="overline">
                    Total Capitalized{" "}
                    <Typography
                      component={"span"}
                      fontStyle={"italic"}
                      variant="overline"
                    >
                      (Capitalized + Fulfillment)
                    </Typography>{" "}
                    ={" "}
                    <Typography
                      color="success.main"
                      variant="subtitle1"
                      fontWeight={"bold"}
                      component={"span"}
                    >
                      {formatNumber(
                        (shareholderDividends.unapproved
                          ?.totalCapitalizedAmount || 0) +
                          (shareholderDividends?.unapproved
                            .totalFulfillmentAmount || 0),
                        2
                      )}{" "}
                      ETB
                    </Typography>
                  </Typography>
                </Box>
              )}
              <Box>
                <ShareholderDividendList
                  dividends={shareholderDividends?.unapproved}
                />
              </Box>
            </Box>
          </Box>
        )}
        {!!shareholderDividends?.approved?.decisions?.length && (
          <Box>
            <Typography
              variant="h6"
              sx={{ lineHeight: 2, flex: 1, py: 1 }}
              color="success.main"
            >
              Approved
            </Typography>
            <Box>
              <ShareholderDividendList
                dividends={shareholderDividends?.approved}
              />
            </Box>
          </Box>
        )}
      </Box>
      {showEditDialog &&
        shareholderDividends?.unapproved?.decisions?.length && (
          <DividendActionDialog
            dividends={shareholderDividends.unapproved}
            disabled={false}
            onClose={() => setShowEditDialog(false)}
          />
        )}
    </>
  );
};
