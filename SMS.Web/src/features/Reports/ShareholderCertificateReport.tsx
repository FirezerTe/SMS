import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useLazyShareCertificateReportQuery } from "../../app/api";
import { ReportComponentProps, ReportComponentRef } from "./utils";

export const ShareholderCertificateReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps & { shareholderId: number } & { certificateId: number }
>(
  (
    {
      onReportParamsValidation,
      onDownloadComplete,
      onError,
      onDownloadStart,
      shareholderId,
      certificateId,
    },
    ref
  ) => {
    const [getShareholderCertificate] = useLazyShareCertificateReportQuery();

    useEffect(() => {
      onReportParamsValidation(true);
    }, [onReportParamsValidation, ref]);

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          onDownloadStart();
          const { error } = await getShareholderCertificate({
            id: shareholderId,
            certificateId: certificateId,
          });
          error ? onError(error) : onDownloadComplete();
        },
      }),
      [getShareholderCertificate, onDownloadComplete, onDownloadStart, onError]
    );

    return <></>;
  }
);
