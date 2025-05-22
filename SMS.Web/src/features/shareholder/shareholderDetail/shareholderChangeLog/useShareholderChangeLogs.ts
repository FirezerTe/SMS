import { useMemo } from "react";
import { useGetShareholderChangeLogQuery } from "../../../../app/api";
import { ApprovalStatus } from "../../../../app/api/enums";
import { shareholderChangeLogsLabels } from "../../../../utils";
import { useCurrentShareholderVersionApprovalStatus } from "../useCurrentShareholderVersionApprovalStatus";
import { useShareholderIdAndVersion } from "../useShareholderIdAndVersion";

export const useShareholderChangeLogs = () => {
  const { id } = useShareholderIdAndVersion();
  const { approvalStatus } = useCurrentShareholderVersionApprovalStatus();

  const { data } = useGetShareholderChangeLogQuery(
    {
      shareholderId: id,
    },
    {
      skip: !id,
    }
  );

  const { changeLabels, changeLogs } = useMemo(() => {
    if (!approvalStatus || approvalStatus === ApprovalStatus.Approved) {
      return { changeLabels: [], changeLogs: undefined };
    }

    return {
      changeLabels: shareholderChangeLogsLabels(data),
      changeLogs: data,
    };
  }, [approvalStatus, data]);

  return {
    changeLogs,
    changeLabels,
  };
};
