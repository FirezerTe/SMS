import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export const useShareholderIdAndVersion = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();

  const version = useMemo(
    () => searchParams.get("version") || undefined,
    [searchParams]
  );

  const id = useMemo(() => +(params?.id || 0), [params?.id]);

  return { version, id };
};
