import { useLayoutEffect } from "react";

export const useResizeObserver = (
  element: HTMLElement | null,
  callback: (payload: { width: number; height: number }) => void
) => {
  useLayoutEffect(() => {
    if (!element) {
      return () => {};
    }
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        callback({
          width: entry.target.clientWidth,
          height: entry.target.clientHeight,
        });
      });
    });
    resizeObserver.observe(element);
    return () => {
      resizeObserver.unobserve(element);
      resizeObserver.disconnect();
    };
  }, [element, callback]);
};
