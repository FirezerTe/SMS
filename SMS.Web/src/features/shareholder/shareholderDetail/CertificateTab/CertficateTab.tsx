import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { useGetShareholderCertificatesQuery } from "../../../../app/api";
import { PaymentMethod, certficateType } from "../../../../app/api/enums";
import { CertificateDialog } from "../../../Certificate/CertificateDialog";
import { CertificateList } from "../../../Certificate/CertificateList";
import { useCurrentShareholderInfo } from "../../useCurrentShareholderInfo";

const emptyCertificateInfo = {
  Paidupamount: "",
  effectiveDate: dayjs(),
  paymentMethodEnum: PaymentMethod.FromAccount,
  certificateNo: "",
  certficateIssuanceTypeEnum: certficateType.Incremental,
} as any;

export const CertificateTab = () => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const shareholder = useCurrentShareholderInfo();
  const { data: certficates, refetch } = useGetShareholderCertificatesQuery(
    {
      id: shareholder?.id || 0,
    },
    { skip: !shareholder?.id }
  );

  const onClose = useCallback(() => {
    setDialogOpened(false);
    refetch();
  }, [refetch]);
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {" "}
        <Button variant="outlined" onClick={() => setDialogOpened(true)}>
          Prepare Certificate
        </Button>
      </Box>
      {dialogOpened && (
        <CertificateDialog
          open={dialogOpened}
          onClose={onClose}
          certificate={emptyCertificateInfo}
          certificateSummeryInfo={certficates || ([] as any)}
        />
      )}

      <CertificateList Certificates={certficates || ([] as any)} />
    </>
  );
};
