import AttachFileIcon from "@mui/icons-material/AttachFile";
import UploadIcon from "@mui/icons-material/Upload";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import {
  ShareholderDetailsDto,
  useUploadShareholderDocumentMutation,
} from "../../../app/api";
import { DocumentType, ShareholderType } from "../../../app/api/enums";
import {
  DialogHeader,
  DocumentUpload,
  FormSelectField,
} from "../../../components";
import { YupShape } from "../../../utils";
import { useAlert } from "../../notification";
import { useShareholderDocumentType } from "./useShareholderDocumentType";

interface DocumentInfo {
  documentType: DocumentType;
}

const validationSchema = yup.object<YupShape<DocumentInfo>>({
  documentType: yup.string().required("Document type is req"),
});

const emptyDocumentInfo = {
  documentType: "",
} as any;

export const DocumentUploadDialog = ({
  onClose,
  shareholder,
}: {
  onClose: () => void;
  shareholder?: ShareholderDetailsDto;
}) => {
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo>();
  const { shareholderDocumentTypeLookups } = useShareholderDocumentType();
  const [attachment, setAttachment] = useState<any>();
  const [uploadDocument] = useUploadShareholderDocumentMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();

  useEffect(() => {
    setDocumentInfo({
      ...emptyDocumentInfo,
    });
  }, []);

  const handleSubmit = useCallback(
    (value?: DocumentInfo) => {
      if (!value?.documentType || !attachment || !shareholder?.id) return;

      uploadDocument({
        shareholderId: shareholder?.id,
        documentType: value.documentType,

        body: {
          file: attachment,
        },
      })
        .unwrap()
        .then(() => {
          const documentTypeLabel = shareholderDocumentTypeLookups.find(
            (x) => x.value === value.documentType
          )?.label;
          showSuccessAlert(`${documentTypeLabel || "Document"} uploaded`);
          onClose();
        })
        .catch(() => {
          showErrorAlert("Error occurred");
        });
    },
    [
      attachment,
      onClose,
      shareholder?.id,
      shareholderDocumentTypeLookups,
      showErrorAlert,
      showSuccessAlert,
      uploadDocument,
    ]
  );

  const attachDocument = useCallback(
    async (files: any[]) => {
      setAttachment(files?.length ? files[0] : undefined);
    },
    [setAttachment]
  );

  const documentTypeOptions = useMemo(() => {
    if (shareholder?.shareholderType !== ShareholderType.Individual)
      return shareholderDocumentTypeLookups;

    return shareholderDocumentTypeLookups.filter(
      (t) =>
        t.value !== DocumentType.ArticlesOfOrganizationOrCertificate &&
        t.value !== DocumentType.OperationalAgreement
    );
  }, [shareholder?.shareholderType, shareholderDocumentTypeLookups]);

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      fullWidth
      maxWidth={"md"}
      open={true}
    >
      {!!documentInfo && (
        <Formik
          initialValues={documentInfo}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
        >
          {({ values }) => {
            return (
              <Form>
                <DialogHeader title={"Upload Document"} onClose={onClose} />
                <DialogContent dividers={true}>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Box sx={{ flex: 1, py: 2 }}>
                      <FormSelectField
                        name="documentType"
                        type="number"
                        placeholder="Document Type"
                        label="Document Type"
                        options={documentTypeOptions}
                        size="small"
                      />
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      {!!attachment && (
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2">
                            {attachment.name || "Document"}
                          </Typography>
                        </Box>
                      )}

                      <Box>
                        {" "}
                        <DocumentUpload
                          label={attachment ? "Update" : "Attach"}
                          showIcon={true}
                          size="medium"
                          onAdd={attachDocument}
                          startIcon={<AttachFileIcon />}
                        />
                      </Box>
                    </Box>
                  </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button
                    color="primary"
                    variant="outlined"
                    type="submit"
                    disabled={!(values.documentType && !!attachment)}
                    startIcon={<UploadIcon />}
                  >
                    Upload
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      )}
    </Dialog>
  );
};
