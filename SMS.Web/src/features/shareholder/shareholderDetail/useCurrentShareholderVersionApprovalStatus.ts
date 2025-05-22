import { useGetShareholderInfoQuery } from "../../../app/api";
import { useShareholderIdAndVersion } from "./useShareholderIdAndVersion";

export const useCurrentShareholderVersionApprovalStatus = () => {
  const { id, version } = useShareholderIdAndVersion();

  const { data: shareholder } = useGetShareholderInfoQuery(
    {
      id,
      version,
    },
    {
      skip: !id,
    }
  );

  return { approvalStatus: shareholder?.approvalStatus };
};
