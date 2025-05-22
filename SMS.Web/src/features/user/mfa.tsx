import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { Box, Button, Fab, Paper, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useVerificationCodeMutation } from "../../app/api";
import { Errors, FormTextField } from "../../components";
import { YupShape } from "../../utils";

interface MFAFormFields {
  code: string;
}

const validationSchema = yup.object<YupShape<MFAFormFields>>({
  code: yup.string().required().required("Verification Code is required"),
});

const initialValues = {
  code: "",
};

export const MFA = () => {
  const navigate = useNavigate();

  const [verify, { error: verifyError, isLoading, reset }] =
    useVerificationCodeMutation();

  const handleSubmit = useCallback(
    (values: MFAFormFields) => {
      reset();
      verify({
        verificationCode: {
          code: values.code,
        },
      })
        .unwrap()
        .then(() => {
          navigate("/");
        })
        .catch(() => {});
    },
    [navigate, reset, verify]
  );

  return (
    <Box
      sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange={true}
      >
        <Form>
          <Paper sx={{ maxWidth: 500, p: 4, minWidth: 400 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Fab color="warning" aria-label="add">
                <VerifiedUserIcon />
              </Fab>

              {verifyError && (
                <Errors errors={{ code: "Verification failed." }} />
              )}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Enter Verification Code</Typography>
                <Typography variant="body2">
                  {`We've sent a verification code to your email`}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <FormTextField
                  autoComplete="off"
                  id="verification-code"
                  name="code"
                  autoFocus
                />

                <Button
                  size="large"
                  sx={{ my: 3 }}
                  variant="contained"
                  type="submit"
                  disabled={isLoading}
                >
                  Verify
                </Button>
              </Box>
            </Box>
          </Paper>
        </Form>
      </Formik>
    </Box>
  );
};
