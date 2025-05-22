import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const useCurrentVersion = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const loadCurrentVersion = useCallback(() => {
    if (searchParams.get("version")) {
      searchParams.delete("version");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  return { loadCurrentVersion };
};
