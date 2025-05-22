import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useGetShareholderDocumentsQuery } from "../../../../app/api";
import { DocumentUploadDialog } from "../../documents";
import { Documents } from "../../documents/Documents";
import { useCurrentShareholderInfo } from "../../useCurrentShareholderInfo";

export const DocumentsTab = () => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const shareholder = useCurrentShareholderInfo();

  const { data: documents } = useGetShareholderDocumentsQuery(
    {
      id: shareholder?.id || 0,
    },
    { skip: !shareholder?.id }
  );

  return (
    <>
      <Box sx={{ pt: 2 }}>
        <Box sx={{ display: "flex" }}>
          <Typography
            variant="h5"
            sx={{ lineHeight: 2, flex: 1 }}
            color="textSecondary"
          >
            Documents
          </Typography>
          <Box>
            <Button
              startIcon={<FileUploadIcon />}
              variant="outlined"
              onClick={() => setShowUploadDialog(true)}
            >
              Upload Document
            </Button>
          </Box>
        </Box>
        <Box>
          {documents?.length ? (
            <Documents documents={documents} shareholder={shareholder} />
          ) : (
            <Box
              sx={{ display: "flex", justifyContent: "center", pt: 2, pb: 4 }}
            >
              <Typography>No document available</Typography>
            </Box>
          )}
        </Box>
      </Box>
      {showUploadDialog && shareholder && (
        <DocumentUploadDialog
          shareholder={shareholder}
          onClose={() => {
            setShowUploadDialog(false);
          }}
        />
      )}
    </>
  );
};
