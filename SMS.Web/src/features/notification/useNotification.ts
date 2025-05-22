import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { removeNotifications, selectNotification } from "./notificationsSlice";

export const useNotification = () => {
  const { notifications } = useAppSelector(selectNotification);
  const dispatch = useAppDispatch();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const notificationsToShow = notifications.filter((x) => !x.shown);
    if (notificationsToShow.length) {
      dispatch(
        removeNotifications({ ids: notificationsToShow.map((x) => x.id) })
      );
      notificationsToShow.forEach((notification) => {
        enqueueSnackbar(notification.message, {
          variant: notification.type,
          preventDuplicate: false,
        });
      });
    }
  }, [dispatch, enqueueSnackbar, notifications]);
};
