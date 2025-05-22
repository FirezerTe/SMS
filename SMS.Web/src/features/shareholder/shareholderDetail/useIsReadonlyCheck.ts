import {
  useGetShareholderInfoQuery,
  useGetShareholderRecordVersionsQuery,
} from "../../../app/api";
import { useShareholderIdAndVersion } from "./useShareholderIdAndVersion";

export const useIsReadonlyCheck = () => {
  const { id, version } = useShareholderIdAndVersion();
  const { data: versions } = useGetShareholderRecordVersionsQuery(
    {
      id,
    },
    {
      skip: !id,
    }
  );

  const { data: shareholderInfo } = useGetShareholderInfoQuery(
    {
      id,
      version,
    },
    {
      skip: !id,
    }
  );

  const isReadonly = !!(
    !id ||
    shareholderInfo?.hasActiveTransfer ||
    (version && versions?.current !== version)
  );

  return { isReadonly };
};
