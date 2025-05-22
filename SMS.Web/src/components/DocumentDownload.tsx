import DownloadIcon from "@mui/icons-material/Download";
import { Button } from "@mui/material";
import { useCallback } from "react";
import { useLazyDownloadDocumentQuery } from "../app/api";

interface Props {
  size?: "small" | "medium" | "large";
  documentId: string;
  label?: string;
  disabled?: boolean;
  showIcon?: boolean;
}
export const DocumentDownload = ({
  documentId,
  size = "small",
  label,
  disabled,
  showIcon = true,
}: Props) => {
  const [downloadReceipt] = useLazyDownloadDocumentQuery();

  const downloadDocument = useCallback(async () => {
    documentId && downloadReceipt({ id: documentId });
  }, [documentId, downloadReceipt]);

  return (
    <Button
      variant="text"
      startIcon={showIcon ? <DownloadIcon /> : null}
      size={size}
      disabled={disabled}
      onClick={downloadDocument}
    >
      {label}
    </Button>
  );
};
