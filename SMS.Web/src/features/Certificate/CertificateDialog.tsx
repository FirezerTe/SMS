import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import {
  CertificateDto,
  CertificateSummeryDto,
  usePrepareShareholderCertificateMutation,
  useUpdateShareholderCertificateMutation,
} from "../../app/api";
import { certficateType } from "../../app/api/enums";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
} from "../../components";
import { removeEmptyFields } from "../../utils";
import { formatNumber } from "../common";
import { usePaymentMethods } from "../paymentMethods";
import { useShareholderIdAndVersion } from "../shareholder/shareholderDetail/useShareholderIdAndVersion";
import { useCertificateTypes } from "./useCertificateTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  certificate: CertificateDto;
  certificateSummeryInfo: CertificateSummeryDto;
}
const emptyCertificateInfo = {
  certificateIssuanceTypeEnum: certficateType.Incremental,
} as any;
export const CertificateDialog = ({
  open,
  onClose,
  certificate,
  certificateSummeryInfo,
}: Props) => {
  const [certificateData, setCertificateData] = useState<CertificateDto>();
  const { paymentMethodLookups } = usePaymentMethods();
  const { certficateTypeLookups } = useCertificateTypes();
  const [makeNewCertificate, { error: newCertificateError }] =
    usePrepareShareholderCertificateMutation();
  const [updateCertificateData, { error: updateCertificateError }] =
    useUpdateShareholderCertificateMutation();
  const { id: shareholderId } = useShareholderIdAndVersion();

  useEffect(() => {
    setCertificateData({
      ...emptyCertificateInfo,
      ...certificate,
    });
  }, [certificate, certificateData]);

  const readOnly = false;
  const handleSubmit = useCallback(
    (value: CertificateDto) => {
      const issueDate = dayjs(value.issueDate).format("YYYY-MM-DD");
      const certificateData: CertificateDto = {
        id: value.id,
        paidupAmount: value.paidupAmount,
        issueDate: issueDate,
        paymentMethodEnum: value.paymentMethodEnum,
        certificateIssuanceTypeEnum: value.certificateIssuanceTypeEnum,
        receiptNo: value.receiptNo,
        note: value.note,
        certificateNo: value.certificateNo,
        shareholderId: shareholderId,
      };

      const certificate = removeEmptyFields(certificateData);

      ((certificate as any)?.id
        ? updateCertificateData({
            updateShareholderCertificateCommand: certificate,
          })
        : makeNewCertificate({
            prepareShareholderCertificateCommand: certificate,
          })
      )
        .unwrap()
        .then(() => {
          onClose();
          window.location.reload();
        })
        .catch(() => {});
    },
    [
      makeNewCertificate,
      onClose,
      updateCertificateData,
      shareholderId,
      certificate,
    ]
  );

  const errors = ((newCertificateError || updateCertificateError) as any)?.data
    ?.errors;
  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      fullWidth
      maxWidth={"md"}
      open={open}
    >
      {!!certificateData && (
        <Formik
          initialValues={certificateData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validateOnChange={true}
        >
          {({ values }) => {
            return (
              <Form>
                <DialogHeader
                  title={
                    certificateData.id
                      ? `Update Certificate`
                      : "Prepare New Certificate"
                  }
                  onClose={onClose}
                />
                <DialogContent dividers={true}>
                  <Grid container spacing={2}>
                    {errors && (
                      <Grid item xs={12}>
                        <Errors errors={errors as any} />
                      </Grid>
                    )}
                    <Grid>
                      <Typography variant="subtitle2">
                        Paiup Amount Available for Certificate:{" "}
                        <Typography
                          component={"span"}
                          variant="subtitle1"
                          color="info.main"
                        >
                          {`${formatNumber(
                            certificateSummeryInfo?.totalAvailablePaidup || 0
                          )} ETB`}
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <FormSelectField
                        name="certificateIssuanceTypeEnum"
                        type="number"
                        placeholder="Certificate Issuance Type"
                        label="Certificate Issuance Type"
                        options={certficateTypeLookups}
                        disabled={readOnly}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        name="paidupAmount"
                        type="number"
                        placeholder="Paid Up Amount (ETB)"
                        label="Paid up Amount (ETB)"
                        disabled={readOnly}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <FormTextField
                          sx={{ flex: 1 }}
                          name="issueDate"
                          type="date"
                          label="Issue Date"
                          disabled={readOnly}
                        />
                      </Box>
                    </Grid>

                    {(values.certificateIssuanceTypeEnum ==
                      certficateType.Replacement ||
                      values.certificateIssuanceTypeEnum ==
                        certficateType.Amalgamation) && (
                      <>
                        <Grid item xs={12}>
                          <FormSelectField
                            name="paymentMethodEnum"
                            type="number"
                            placeholder="Payment Method"
                            label="Payment Method"
                            options={paymentMethodLookups}
                            disabled={readOnly}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormTextField
                            name="receiptNo"
                            type="text"
                            placeholder="Payment Receipt #"
                            label="Payment Receipt #"
                          />
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12}>
                      <FormTextField
                        name="certificateNo"
                        type="text"
                        placeholder="Certificate Number"
                        label="Certificate Number"
                        disabled={readOnly}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        name="note"
                        type="text"
                        placeholder="Note"
                        label="Note"
                        fullWidth
                        multiline
                        minRows={3}
                        variant="outlined"
                        disabled={readOnly}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={onClose} disabled={readOnly}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    variant="outlined"
                    type="submit"
                    disabled={readOnly}
                  >
                    Save
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
