import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { Form, Formik } from "formik";
import { useCallback } from "react";
import * as yup from "yup";
import { AddressDto } from "../../../../app/api";
import { FormSelectField, FormTextField } from "../../../../components";
import { usePermission } from "../../../../hooks";
import { YupShape } from "../../../../utils";
import { useCountries } from "../../../countries";

const validationSchema = yup.object<YupShape<AddressDto>>({
  id: yup.number().optional(),
  countryId: yup.number().required("Country is required"),
  city: yup.string().required("City is required."),
  subCity: yup.string().required("SubCity is required."),
  kebele: yup.string().required("Kebele is required."),
  woreda: yup.string().required("Woreda is required."),
  houseNumber: yup.string().required("HouseNumber is required."),
});

const initialAddressValue = {
  countryId: "",
  city: "",
  subCity: "",
  kebele: "",
  woreda: "",
  houseNumber: "",
} as any;

interface Props {
  shareholderId: number;
  address?: AddressDto;
  open: boolean;
  onClose: () => void;
  onSubmit: (address: AddressDto) => void;
}
export const AddressDialog = ({
  shareholderId,
  address,
  open,
  onSubmit,
  onClose,
}: Props) => {
  const { countryLookups, defaultCountryId } = useCountries();
  const permissions = usePermission();

  const handleSubmit = useCallback(
    async (values: AddressDto) => {
      await onSubmit(values);
    },
    [onSubmit]
  );

  if (!open) {
    return null;
  }
  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={open}
    >
      <Formik
        initialValues={{
          ...initialAddressValue,
          shareholderId,
          ...{ countryId: defaultCountryId, ...address },
        }}
        enableReinitialize={true}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange={true}
      >
        <Form>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {!address ? "New Address" : "Edit Address"}
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
                <FormTextField
                  name="kebele"
                  type="text"
                  placeholder="Kebele"
                  label="Kebele"
                />
              </Grid>

              <Grid item xs={12}>
                <FormTextField
                  name="woreda"
                  type="text"
                  placeholder="Woreda"
                  label="Woreda"
                />
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
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              color="primary"
              variant="outlined"
              type="submit"
              disabled={!permissions.canCreateOrUpdateShareholderInfo}
            >
              Save
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};
