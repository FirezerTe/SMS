import KeyIcon from "@mui/icons-material/Key";
import { Box, Button, Divider, Grid, Paper } from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { useResetPasswordMutation } from "../../app/api";
import { Errors, FormTextField, PageHeader } from "../../components";
import { useAlert } from "../../features";
import { YupShape } from "../../utils";

interface ResetPasswordFields {
  password: string;
  confirmPassword?: string;
}
const validationSchema = yup.object<YupShape<ResetPasswordFields>>({
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .nullable()
    .oneOf([yup.ref("password"), null], "Password must match"),
});

const emptyFormData: ResetPasswordFields = {
  password: "",
  confirmPassword: "",
};

export const ForgotPassword = () => {
  const navigator = useNavigate();

  const [searchParams] = useSearchParams();
  const [resetPassword, { error }] = useResetPasswordMutation();
  const { showSuccessAlert, showErrorAlert } = useAlert();

  const { token, email } = useMemo(
    () => ({
      token: searchParams.get("token"),
      email: searchParams.get("email"),
    }),
    [searchParams]
  );

  const handleSubmit = useCallback(
    (value: ResetPasswordFields) => {
      resetPassword({
        resetPasswordPayload: {
          email,
          token,
          password: value.password.trim(),
        },
      })
        .unwrap()
        .then(() => {
          showSuccessAlert("Password changed");
          navigator("/");
        })
        .catch(() => {
          showErrorAlert("Error occurred");
        });
    },
    [email, navigator, resetPassword, showErrorAlert, showSuccessAlert, token]
  );

  const errors = (error as any)?.data;

  return (
    <>
      <Box sx={{ pt: 4, display: "flex", justifyContent: "center" }}>
        <PageHeader
          icon={
            <KeyIcon sx={{ fontSize: "inherit", verticalAlign: "middle" }} />
          }
          title={"Reset Password"}
        />
      </Box>
      <Box sx={{ display: "flex", p: 6, justifyContent: "center" }}>
        <Paper>
          <Box sx={{ pt: 8, pb: 4, px: 4 }}>
            <Formik
              initialValues={emptyFormData}
              enableReinitialize={true}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
              validateOnChange={true}
            >
              <Form>
                <Grid container spacing={2}>
                  {errors && (
                    <Grid item xs={12}>
                      <Errors errors={errors as any} />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <FormTextField
                      name="password"
                      type="password"
                      placeholder="Enter new password"
                      label="Enter new password"
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
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        pt: 2,
                        gap: 2,
                      }}
                    >
                      <Button
                        onClick={() => {
                          navigator("/");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button color="primary" variant="contained" type="submit">
                        Reset Password
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            </Formik>
          </Box>
        </Paper>
      </Box>
    </>
  );
};
