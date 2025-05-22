import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForgotPasswordMutation, useLoginMutation } from "../../app/api";
import logo from "../../assets/transparent-logo.png";
import { FormTextField } from "../../components/form-controls";
import { YupShape } from "../../utils";
import { useAlert } from "../notification";

const style: SxProps = {
  position: "absolute",
  top: "25%",
  left: "50%",
  transform: "translate(-50%, -25%)",
  boxShadow: 24,
  display: "flex",
  maxWidth: "800px",
};

interface LoginFormFields {
  email: string;
  password: string;
}

const validationSchema = yup.object<YupShape<LoginFormFields>>({
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const initialValues = {
  email: "",
  password: "",
};

export const Login = () => {
  const [login, loginResponse] = useLoginMutation();
  const [sendPwdResetEmail] = useForgotPasswordMutation();
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const { showSuccessAlert } = useAlert();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (values: LoginFormFields) => {
      login({ loginDto: values })
        .unwrap()
        .then()
        .catch((e) => {
          if (e?.data?.needVerification) {
            navigate("/verify");
          }
        });
    },
    [login, navigate]
  );

  const onRequestPasswordResetLink = useCallback(() => {
    if (forgotPasswordEmail) {
      sendPwdResetEmail({
        forgotPasswordPayload: {
          email: forgotPasswordEmail,
        },
      })
        .unwrap()
        .then(() => {
          showSuccessAlert(
            `Password reset link sent to ${forgotPasswordEmail}`
          );
          setForgotPassword(false);
          setForgotPasswordEmail("");
        })
        .catch(() => {});
    }
  }, [forgotPasswordEmail, sendPwdResetEmail, showSuccessAlert]);

  return (
    <Box sx={{ position: "relative", flex: 1, height: "100%" }}>
      <Paper sx={style} variant="elevation" elevation={2}>
        <Grid container>
          <Grid
            xs={4}
            item
            sx={{
              display: "flex",
              flex: 0,
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#eaaa00",
              p: 3,
            }}
          >
            <img src={logo} alt="logo" />
          </Grid>
          {forgotPassword && (
            <Grid item xs={8}>
              <Grid container spacing={3} sx={{ p: 3 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ pb: 1 }}>
                    Forgot Password?
                  </Typography>
                  <Typography variant="subtitle2" sx={{ pb: 2 }}>
                    Enter your email.
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    id="userEmail"
                    name="userEmail"
                    type="email"
                    placeholder="Email"
                    label="Email"
                    fullWidth
                    autoFocus
                    autoComplete="off"
                    onChange={(e) => {
                      setForgotPasswordEmail(e.target.value?.trim());
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    className="button-block"
                    onClick={onRequestPasswordResetLink}
                    sx={{ py: 1.5 }}
                    disabled={!forgotPasswordEmail}
                  >
                    Request reset link
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    disabled={loginResponse?.isLoading}
                    onClick={() => {
                      setForgotPassword(false);
                      setForgotPasswordEmail("");
                    }}
                  >
                    <strong>Back To Login</strong>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}
          {!forgotPassword && (
            <Grid item xs={8}>
              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
                validateOnChange={true}
              >
                <Form>
                  <Grid container spacing={2} sx={{ p: 3 }}>
                    {loginResponse?.error && (
                      <Grid item xs={12} sx={{ mb: 1 }}>
                        <Alert severity="error">
                          {(loginResponse.error as any).data?.isLockedOut ? (
                            <Typography>
                              Your account is locked out. Please contact SMS
                              team.
                            </Typography>
                          ) : (
                            <Typography>
                              {" "}
                              Invalid <strong> email</strong> or{" "}
                              <strong>password.</strong>
                            </Typography>
                          )}
                        </Alert>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <FormTextField
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        label="Email"
                        autoFocus
                        autoComplete="username"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        id="password"
                        label="Password"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                      />
                      <Button
                        disabled={loginResponse?.isLoading}
                        onClick={() => {
                          setForgotPassword(true);
                        }}
                      >
                        <strong>Forgot password?</strong>
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        className="button-block"
                        sx={{ py: 1.5 }}
                        disabled={loginResponse?.isLoading}
                      >
                        Login
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              </Formik>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};
