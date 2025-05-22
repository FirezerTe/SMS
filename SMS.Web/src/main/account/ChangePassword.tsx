import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import * as yup from "yup";
import { useChangePasswordMutation } from "../../app/api";
import { DialogHeader, Errors, FormTextField } from "../../components";
import { useAlert } from "../../features";
import { YupShape } from "../../utils";

interface ChangePasswordFields {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}
const validationSchema = yup.object<YupShape<ChangePasswordFields>>({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup.string().required("New password is required"),
  confirmPassword: yup
    .string()
    .nullable()
    .oneOf([yup.ref("newPassword"), null], "Password must match"),
});

const emptyFormData: ChangePasswordFields = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const ChangePasswordDialog = ({ onClose }: { onClose: () => void }) => {
  const [changePassword, { error: changePasswordError }] =
    useChangePasswordMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const handleSubmit = useCallback(
    (value: ChangePasswordFields) => {
      changePassword({
        changePasswordPayload: {
          currentPassword: value.currentPassword,
          newPassword: value.newPassword.trim(),
        },
      })
        .unwrap()
        .then(() => {
          onClose();
          showSuccessAlert("Password Changed.");
        })
        .catch(() => {
          showErrorAlert("Error occurred");
        });
    },
    [changePassword, onClose, showErrorAlert, showSuccessAlert]
  );

  const errors = (changePasswordError as any)?.data;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      fullWidth
      maxWidth={"sm"}
      open={true}
    >
      <Formik
        initialValues={emptyFormData}
        enableReinitialize={true}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange={true}
      >
        <Form>
          <DialogHeader title={"Change Password"} onClose={onClose} />
          <DialogContent dividers={true}>
            <Grid container spacing={2}>
              {errors && (
                <Grid item xs={12}>
                  <Errors errors={errors as any} />
                </Grid>
              )}
              <Grid item xs={12}>
                <FormTextField
                  name="currentPassword"
                  type="password"
                  placeholder="Current Password"
                  label="Current Password"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  name="newPassword"
                  type="password"
                  placeholder="New Password"
                  label="New Password"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12}>
                <FormTextField
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  label="Confirm new password"
                  autoComplete="off"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button color="primary" variant="outlined" type="submit">
              Change Password
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
