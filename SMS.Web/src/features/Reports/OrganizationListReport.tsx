import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { ReportComponentProps, ReportComponentRef } from "./utils";
import { ShareholderType, useLazyOrganizationReportQuery } from "../../app/api";

import ShareholderTypeComponent from "./ShareholderTypeReport";

export const OrganizationListReport = forwardRef<
  ReportComponentRef,
  ReportComponentProps
>(
  (
    { onReportParamsValidation, onDownloadComplete, onError, onDownloadStart },
    ref
  ) => {
    const [getOrganization] = useLazyOrganizationReportQuery();
    const [selectedShareholderType, setSelectedShareholderType] =
      useState<ShareholderType>();

    useEffect(() => {
      onReportParamsValidation(!!selectedShareholderType);
    }, [onReportParamsValidation, selectedShareholderType]);

    useImperativeHandle(
      ref,
      () => ({
        submit: async () => {
          if (selectedShareholderType) {
            onDownloadStart();
            const { error } = await getOrganization({
              list: selectedShareholderType as any,
            });
            error ? onError(error) : onDownloadComplete();
          }
        },
      }),
      [
        selectedShareholderType,
        getOrganization,
        onDownloadComplete,
        onDownloadStart,
        onError,
      ]
    );

    return (
      <ShareholderTypeComponent onChange={setSelectedShareholderType as any} />
    );
  }
);
