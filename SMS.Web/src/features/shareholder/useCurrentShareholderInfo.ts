import { useGetShareholderByIdQuery } from "../../app/api";
import { useShareholderIdAndVersion } from "./shareholderDetail";

export const useCurrentShareholderInfo = () => {
  const { id } = useShareholderIdAndVersion();
  const { data } = useGetShareholderByIdQuery(
    {
      id,
    },
    { skip: !id }
  );

  return data;
};
