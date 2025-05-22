import { useCallback } from "react";
import { useAppDispatch } from "../../app/hooks";
import { addNotification } from "./notificationsSlice";

export const useAlert = () => {
  const dispatch = useAppDispatch();

  const showInfoAlert = useCallback(
    (message: string) => {
      dispatch(
        addNotification({
          type: "info",
          message,
        })
      );
    },
    [dispatch]
  );

  const showSuccessAlert = useCallback(
    (message: string) => {
      dispatch(
        addNotification({
          type: "success",
          message,
        })
      );
    },
    [dispatch]
  );

  const showWarningAlert = useCallback(
    (message: string) => {
      dispatch(
        addNotification({
          type: "warning",
          message,
        })
      );
    },
    [dispatch]
  );

  const showErrorAlert = useCallback(
    (message: string) => {
      dispatch(
        addNotification({
          type: "error",
          message,
        })
      );
    },
    [dispatch]
  );

  return { showWarningAlert, showInfoAlert, showSuccessAlert, showErrorAlert };
};
