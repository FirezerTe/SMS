import UploadIcon from "@mui/icons-material/Upload";
import { Button } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";

export type FileTypes = "Image" | "PDF";

interface Props {
  label?: string;
  multiple?: boolean;
  showIcon?: boolean;
  size?: "small" | "medium" | "large";
  onAdd: (files: any) => void;
  accepts?: FileTypes[];
  disabled?: boolean;
  startIcon?: JSX.Element;
}
export const DocumentUpload = ({
  label,
  showIcon = true,
  multiple = false,
  size,
  onAdd,
  accepts = ["Image", "PDF"],
  disabled,
  startIcon,
}: // accepts,
Props) => {
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      onAdd(acceptedFiles);
    },
    [onAdd]
  );

  const fileTypes = useMemo(() => {
    if (!accepts?.length) return;

    const fileTypes: { [key: string]: string[] } = {};
    if (accepts.some((x) => x === "Image")) {
      fileTypes["image/*"] = [".png", ".jpeg", ".jpg"];
    }
    if (accepts.some((x) => x === "PDF")) {
      fileTypes["application/pdf"] = [".pdf"];
    }
    return fileTypes;
  }, [accepts]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple,
    accept: fileTypes,
  });

  return (
    <Button
      variant="text"
      startIcon={showIcon ? startIcon || <UploadIcon /> : null}
      {...getRootProps()}
      size={size}
      disabled={disabled}
    >
      <input {...getInputProps()} />
      {label || "Upload"}
    </Button>
  );
};
