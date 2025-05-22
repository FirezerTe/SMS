import { debounce } from "lodash-es";
import { useEffect, useMemo, useState } from "react";

export const useDebounce = <T>(value: T, delay: number): T | undefined => {
  const [debouncedValue, setDebouncedValue] = useState<T>();

  const setDebouncedValue_ = useMemo(
    () =>
      debounce((v: T) => {
        setDebouncedValue(v);
      }, delay),
    [delay]
  );

  useEffect(() => {
    debouncedValue !== value && setDebouncedValue_(value);
  }, [debouncedValue, setDebouncedValue_, value]);

  return debouncedValue;
};
