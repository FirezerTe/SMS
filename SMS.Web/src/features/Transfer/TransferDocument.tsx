import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, Divider, IconButton, Popover, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { TransferDto, useUploadTransferDocumentMutation } from "../../app/api";
import { TransferDocumentType, TransferType } from "../../app/api/enums";
import { DocumentDownload, DocumentUpload } from "../../components";
import { usePermission } from "../../hooks";
import { useAlert } from "../notification";

export const TransferDocument = ({ transfer }: { transfer: TransferDto }) => {
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [uploadDocument] = useUploadTransferDocumentMutation();
  const permissions = usePermission();

  const uploadTransferDocument =
    (transferId: number, documentType: TransferDocumentType) =>
    async (files: any[]) => {
      if (files?.length) {
        uploadDocument({
          transferId,
          documentType,
          body: {
            file: files[0],
          },
        })
          .unwrap()
          .then(() => {
            showSuccessAlert("Document uploaded");
          })
          .catch(() => {
            showErrorAlert("Error occurred");
          });
      }
    };

  const agreementDocs = (transfer.transferDocuments || []).filter(
    (d) => d.documentType === TransferDocumentType.Agreement
  );

  const capitalGainTaxDocs = (transfer.transferDocuments || []).filter(
    (d) => d.documentType === TransferDocumentType.CapitalGainTaxReceipt
  );

  const additionalDocs = (transfer.transferDocuments || []).filter(
    (d) => d.documentType === TransferDocumentType.Unspecified
  );

  const shouldHaveCapitalGainTax =
    transfer.transferType === TransferType.Sale &&
    (transfer?.sellValue || 0) > (transfer?.totalTransferAmount || 0);

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle2">Documents: </Typography>
          {<NoDocumentWarning transfer={transfer} />}
        </Box>
      </Box>
      {
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "baseline",
            px: 2,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography variant="subtitle2">Agreement Form</Typography>
              <Box>
                {agreementDocs.map((d) => (
                  <DocumentDownload
                    key={d.id}
                    documentId={d.documentId!}
                    label={d.fileName || "Download"}
                  />
                ))}
              </Box>
              {permissions.canCreateOrUpdatePayment && (
                <DocumentUpload
                  onAdd={uploadTransferDocument(
                    transfer.id!,
                    TransferDocumentType.Agreement
                  )}
                  label={agreementDocs.length ? "Change" : "Upload"}
                  showIcon={true}
                  size="medium"
                />
              )}
            </Box>
            <Divider />
            {shouldHaveCapitalGainTax && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography variant="subtitle2">
                  Capital Gain Tax Receipt
                </Typography>

                <Box>
                  {capitalGainTaxDocs.map((d) => (
                    <DocumentDownload
                      key={d.id}
                      documentId={d.documentId!}
                      label={d.fileName || "Download"}
                    />
                  ))}
                </Box>
                {permissions.canCreateOrUpdatePayment && (
                  <DocumentUpload
                    onAdd={uploadTransferDocument(
                      transfer.id!,
                      TransferDocumentType.CapitalGainTaxReceipt
                    )}
                    label={capitalGainTaxDocs.length ? "Change" : "Upload"}
                    showIcon={true}
                    size="medium"
                  />
                )}
              </Box>
            )}
            <Divider />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Typography variant="subtitle2">Additional Documents</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "baseline",
                }}
              >
                {additionalDocs.map((d, index) => (
                  <DocumentDownload
                    key={d.id}
                    documentId={d.documentId!}
                    label={d.fileName || `Document ${index + 1}`}
                  />
                ))}
              </Box>
              {permissions.canCreateOrUpdatePayment && (
                <Box>
                  <DocumentUpload
                    onAdd={uploadTransferDocument(
                      transfer.id!,
                      TransferDocumentType.Unspecified
                    )}
                    label={"Upload additional document"}
                    showIcon={true}
                    size="medium"
                  />
                </Box>
              )}
            </Box>
            <Divider />
          </Box>
        </Box>
      }
    </Box>
  );
};

const NoDocumentWarning = ({ transfer }: { transfer: TransferDto }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { agreementDocAttached, capitalGainTaxReceiptAttached } =
    useMemo(() => {
      const agreementDocAttached = transfer.transferDocuments?.some(
        (t) => t.documentType === TransferDocumentType.Agreement
      );

      const shouldHaveCapitalGainTax =
        transfer.transferType === TransferType.Sale &&
        (transfer?.sellValue || 0) > (transfer?.totalTransferAmount || 0);

      const capitalGainTaxReceiptAttached = shouldHaveCapitalGainTax
        ? transfer.transferDocuments?.some(
            (t) => t.documentType === TransferDocumentType.CapitalGainTaxReceipt
          )
        : true;

      return {
        agreementDocAttached,
        capitalGainTaxReceiptAttached,
        shouldHaveCapitalGainTax,
      };
    }, [
      transfer?.sellValue,
      transfer?.totalTransferAmount,
      transfer.transferDocuments,
      transfer.transferType,
    ]);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (agreementDocAttached && capitalGainTaxReceiptAttached) return null;

  return (
    <Box>
      <IconButton
        aria-label="warning"
        color="error"
        size="small"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <WarningAmberIcon fontSize="inherit" />
      </IconButton>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Box sx={{ p: 1, display: "flex", flexDirection: "column" }}>
          {!agreementDocAttached && (
            <Typography variant="caption" color="warning.main">
              Agreement Document is not attached
            </Typography>
          )}
          {!capitalGainTaxReceiptAttached && (
            <Typography variant="caption" color="warning.main">
              Capital Gain Tax Receipt is not attached
            </Typography>
          )}
        </Box>
      </Popover>
    </Box>
  );
};
