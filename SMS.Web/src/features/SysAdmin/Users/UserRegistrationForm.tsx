import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import * as yup from "yup";
import { RegisterDto } from "../../../api-client/api-client";
import {
  Errors,
  FormCheckboxList,
  FormSelectField,
  FormTextField,
  SelectOption,
} from "../../../components";
import { YupShape } from "../../../utils";
import { useBranches } from "../../Branch";

const initialValues = {
  email: "",
  password: "",
  firstName: "",
  middleName: "",
  lastName: "",
  branchId: "",
  roles: [],
};

const validationSchema = yup.object<YupShape<RegisterDto>>({
  email: yup.string().email().required("Email is required"),
  firstName: yup.string().required("First Name is required"),
  middleName: yup.string().required("Middle Name is required"),
  lastName: yup.string().required("Last Name is required"),
  branchId: yup.number().required("Branch is required."),
});

interface Props {
  user?: RegisterDto;
  roles?: SelectOption[];
  onCancel?: () => void;
  onSubmit: (User: RegisterDto) => void;
  errors?: any;
}

export const UserRegistrationForm = ({
  onCancel,
  user,
  onSubmit,
  roles,
  errors,
}: Props) => {
  const handleSubmit = useCallback(
    async (user: RegisterDto) => {
      onSubmit(user);
    },
    [onSubmit]
  );

  const { branchLookups } = useBranches();

  return (
    <Formik
      initialValues={{ ...initialValues, ...user }}
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
              name="email"
              type="text"
              placeholder="Email"
              label="Email"
              autoComplete="off"
            />
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              name="firstName"
              type="text"
              placeholder="First Name"
              label="First Name"
            />
          </Grid>
          <Grid item xs={12}>
            <FormTextField
              name="middleName"
              type="text"
              placeholder="Middle Name"
              label="Middle Name"
            />
          </Grid>
          <Grid item xs={12}>
            <FormTextField
              name="lastName"
              type="text"
              placeholder="Last Name"
              label="Last Name"
            />
          </Grid>
          <Grid item xs={12}>
            <FormSelectField
              name="branchId"
              type="number"
              placeholder="Branch"
              label="Branch"
              options={branchLookups}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography sx={{ my: 2 }} variant="h5">
              Roles
            </Typography>
            <Box sx={{ ml: 2 }}>
              <FormCheckboxList
                name="roles"
                options={roles || []}
                orientation="horizontal"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ py: 2 }}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", my: 2 }}>
              <Button
                color="primary"
                variant="outlined"
                type="submit"
                sx={{ mr: 1 }}
              >
                {!user ? "Add" : "Update"}
              </Button>
              <Button onClick={onCancel}>Cancel</Button>
            </Box>
          </Grid>
        </Grid>
      </Form>
    </Formik>
  );
};
