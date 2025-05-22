import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DialogActions from "@mui/material/DialogActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CertificateDto,
  CertificateSummeryDto,
  useGetShareholderCertificatesQuery,
  useUploadCertificateIssueDocumentMutation,
} from "../../app/api";
import { ApprovalStatus } from "../../app/api/enums";
import { DocumentUpload } from "../../components";
import { useModal, usePermission } from "../../hooks";
import { CertificateTypeLabel } from "../../utils";
import { ShareholderCertificateReport } from "../Reports/ShareholderCertificateReport";
import { useAlert } from "../notification";
import { useCurrentShareholderInfo } from "../shareholder";
import { useCurrentVersion } from "../shareholder/useCurrentVersion";
import { ActivateDeactivateCertificate } from "./ActivateDeactivateCertificateConfirmationDialog";
import { CertificateDialog } from "./CertificateDialog";

interface Props {
  Certificates: CertificateSummeryDto;
}
export type CertificateAction = "edit";

export const CertificateList = ({ Certificates }: Props) => {
  const [isFetching, setIsFetching] = useState(false);
  const [reportDataReady, setReportDataReady] = useState(false);
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const { loadCurrentVersion } = useCurrentVersion();
  const [uploadCertificateIssueDocument] =
    useUploadCertificateIssueDocumentMutation();
  const permissions = usePermission();
  const [selectedCertificateId, setSelectedCertificateId] = useState<
    number | null
  >(null);
  const shareholder = useCurrentShareholderInfo();
  const { data: certficates, refetch } = useGetShareholderCertificatesQuery(
    {
      id: shareholder?.id || 0,
    },
    { skip: !shareholder?.id }
  );
  const { isOpen, toggle } = useModal();
  const ref = useRef<{
    submit: () => void;
  }>();
  const [selectedCertificate, setSelectedCertificate] = useState<{
    action: CertificateAction;
    certificate: CertificateDto;
  }>();

  const uploadPaymentRecept =
    (certificateId: number) => async (files: any[]) => {
      if (files?.length) {
        uploadCertificateIssueDocument({
          id: certificateId,
          body: {
            file: files[0],
          },
        })
          .unwrap()
          .then(() => {
            showSuccessAlert("Receipt uploaded");
          })
          .catch(() => {
            showErrorAlert("Error occurred");
          });
      }
    };

  const onError = useCallback(
    (_: any) => {
      showErrorAlert("Error occurred");
      setIsFetching(false);
    },
    [showErrorAlert]
  );

  const onDownloadStart = useCallback(() => {
    setIsFetching(true);
  }, []);
  const onDownloadComplete = useCallback(() => {
    setIsFetching(false);
    setSelectedCertificateId(null);
    loadCurrentVersion();
    refetch();
  }, [isFetching, selectedCertificateId, loadCurrentVersion, refetch]);

  const handleGenerateCertificate = async () => {
    if (selectedCertificateId) {
      setIsFetching(true);
      await ref.current?.submit?.();
    }
  };
  useEffect(() => {
    if (selectedCertificate) {
      setSelectedCertificate(selectedCertificate);
    }
  }, [selectedCertificate, refetch, certficates]);

  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 400 }} size="medium" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Certificate Number</TableCell>
              <TableCell>IssueDate</TableCell>
              <TableCell>PaidUp Amount Issued</TableCell>
              <TableCell>Certificate Type</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(Certificates.certificates || []).map((certificate) => {
              const {
                id,
                issueDate,
                paidupAmount,
                isPrinted,
                shareholderId,
                certificateNo,
                isActive,
                certificateIssuanceTypeEnum,
              } = certificate;
              const isSelectedCertificate = selectedCertificateId === id;
              return (
                <TableRow hover={true} key={id}>
                  <TableCell component="th" scope="row">
                    {certificateNo}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {`${issueDate}`}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {paidupAmount}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {certificateIssuanceTypeEnum &&
                      CertificateTypeLabel[certificateIssuanceTypeEnum]}
                  </TableCell>

                  <TableCell sx={{ py: 0, width: 300 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <>
                        {certificate &&
                          certificate.approvalStatus !==
                            ApprovalStatus.Approved &&
                          shareholder?.approvalStatus !==
                            ApprovalStatus.Approved &&
                          !isPrinted && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <DocumentUpload
                                onAdd={uploadPaymentRecept(id as any)}
                                label={"Receipt"}
                                showIcon={true}
                                size="small"
                                disabled={
                                  !permissions.canCreateOrUpdateShareholderInfo
                                }
                              />
                            </Box>
                          )}

                        {certificate.approvalStatus !==
                          ApprovalStatus.Approved &&
                          shareholder?.approvalStatus !==
                            ApprovalStatus.Approved &&
                          !isPrinted && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Button
                                size="small"
                                onClick={() => {
                                  setSelectedCertificate({
                                    certificate,
                                    action: "edit",
                                  });
                                  toggle();
                                }}
                                startIcon={<EditIcon />}
                              >
                                Edit
                              </Button>
                            </Box>
                          )}
                        {isPrinted && isActive && (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <ActivateDeactivateCertificate
                              certificate={certificate}
                            />
                          </Box>
                        )}
                        {shareholder?.approvalStatus ===
                          ApprovalStatus.Approved &&
                          !isPrinted && (
                            <DialogActions sx={{ p: 2 }}>
                              <Button
                                startIcon={
                                  isSelectedCertificate && isFetching ? (
                                    <CircularProgress size={16} />
                                  ) : undefined
                                }
                                color="primary"
                                variant="outlined"
                                type="submit"
                                disabled={!reportDataReady || isFetching}
                                onClick={() => {
                                  setSelectedCertificateId(id as any);
                                  handleGenerateCertificate();
                                }}
                              >
                                Generate Certificate
                              </Button>
                            </DialogActions>
                          )}
                      </>
                    </Box>
                  </TableCell>
                  <ShareholderCertificateReport
                    ref={ref as any}
                    onReportParamsValidation={setReportDataReady}
                    shareholderId={shareholderId as any}
                    certificateId={selectedCertificateId as any}
                    onDownloadComplete={onDownloadComplete}
                    onError={onError}
                    onDownloadStart={onDownloadStart}
                  />
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedCertificate?.action === "edit" &&
        selectedCertificate?.certificate && (
          <CertificateDialog
            onClose={toggle}
            open={isOpen}
            certificate={selectedCertificate.certificate}
            certificateSummeryInfo={Certificates}
          />
        )}
    </>
  );
};
