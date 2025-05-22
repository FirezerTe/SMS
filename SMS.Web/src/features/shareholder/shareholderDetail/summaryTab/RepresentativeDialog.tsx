import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import * as yup from "yup";
import { YupShape, removeEmptyFields } from "../../../../utils";

type RepresentativeInfo = {
  name?: string;
  email?: string;
  phoneNumber?: string;
  countryId?: number;
  city?: string;
  subCity?: string;
  kebele?: string;
  woreda?: string;
  houseNumber?: string;
};

import { Grid } from "@mui/material";

import { useSaveShareholderRepresentativeMutation } from "../../../../app/api";
import { FormSelectField, FormTextField } from "../../../../components";
import { usePermission } from "../../../../hooks";
import { useCountries } from "../../../countries";
import { useAlert } from "../../../notification";

const validationSchema = yup.object<YupShape<RepresentativeInfo>>({
  email: yup.string().email("Invalid email"),
});

const initialAddressValue: RepresentativeInfo = {
  name: "",
  email: "",
  phoneNumber: "",
  countryId: "" as any,
  city: "",
  subCity: "",
  kebele: "",
  woreda: "",
  houseNumber: "",
};

interface Props {
  shareholderId: number;
  representativeInfo: RepresentativeInfo;
  open: boolean;
  onClose: () => void;
}
export const RepresentativeDialog = ({
  shareholderId,
  representativeInfo,
  open,
  onClose,
}: Props) => {
  const { showErrorAlert, showSuccessAlert } = useAlert();
  const [save] = useSaveShareholderRepresentativeMutation();
  const { countryLookups, defaultCountryId } = useCountries();
  const permission = usePermission();

  const handleSubmit = useCallback(
    async (values: RepresentativeInfo) => {
      save({
        saveShareholderRepresentativeCommand: removeEmptyFields({
          shareholderId,
          email: values.email,
          phoneNumber: values.phoneNumber,
          name: values.name,
          address: {
            countryId: values.countryId,
            city: values.city,
            subCity: values.subCity,
            kebele: values.kebele,
            woreda: values.woreda,
            houseNumber: values.houseNumber,
          },
        }),
      })
        .unwrap()
        .then(() => {
          showSuccessAlert("Saved");
          onClose();
        })
        .catch(() => {
          showErrorAlert("Error occurred");
        });
    },
    [onClose, save, shareholderId, showErrorAlert, showSuccessAlert]
  );

  if (!open) {
    return null;
  }
  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      <Formik
        initialValues={{
          ...initialAddressValue,
          ...{
            ...representativeInfo,
            countryId: representativeInfo.countryId || defaultCountryId,
          },
        }}
        enableReinitialize={true}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange={true}
      >
        {({ isValid, touched, dirty }) => (
          <Form>
            <DialogTitle sx={{ m: 0, p: 2 }}>
              Representative Info
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers={true} sx={{ width: 600 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormTextField
                    name="name"
                    type="text"
                    placeholder="Name"
                    label="Name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormTextField
                    name="email"
                    type="text"
                    placeholder="Email"
                    label="Email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormTextField
                    name="phoneNumber"
                    type="text"
                    placeholder="Phone Number"
                    label="Phone Number"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ py: 1 }} variant="h6">
                    Address
                  </Typography>
                  <Box sx={{ p: 1 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <FormSelectField
                          name="countryId"
                          type="number"
                          placeholder="Country"
                          label="Country"
                          options={countryLookups}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormTextField
                          name="city"
                          type="text"
                          placeholder="City"
                          label="City"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <FormTextField
                          name="subCity"
                          type="text"
                          placeholder="Sub-City"
                          label="Sub-City"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <FormTextField
                            name="woreda"
                            type="text"
                            placeholder="Woreda"
                            label="Woreda"
                          />
                          <FormTextField
                            name="kebele"
                            type="text"
                            placeholder="Kebele"
                            label="Kebele"
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <FormTextField
                          name="houseNumber"
                          type="text"
                          placeholder="House Number"
                          label="House Number"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                color="primary"
                variant="outlined"
                type="submit"
                disabled={
                  !permission.canCreateOrUpdateShareholderInfo ||
                  !dirty ||
                  (touched && !isValid)
                }
              >
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
