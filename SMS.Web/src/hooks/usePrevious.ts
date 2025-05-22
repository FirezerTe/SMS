import { useEffect, useRef } from "react";

export const usePrevious = <T>(props: T) => {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    ref.current = props;
  }, [props]);
  return ref.current;
};
