import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback, useMemo } from "react";
import * as yup from "yup";
import { ContactDto } from "../../../../app/api";
import { ContactType } from "../../../../app/api/enums";
import {
  DialogHeader,
  FormPhoneNumber,
  FormSelectField,
  FormTextField,
  SelectOption,
} from "../../../../components";
import { YupShape } from "../../../../utils";
import { ContactTypeLookup } from "../../../common";

//TBD: add email validation
const validationSchema = yup.object<YupShape<ContactDto>>({
  id: yup.number().optional(),
  type: yup.number().required("Type is required"),
  value: yup
    .string()
    .required("Value is required")
    .when("type", ([type], yup) => {
      return (
        (type &&
          type === ContactType.Email &&
          yup.email("Invalid Email Address")) ||
        yup
      );
    }),
});

const initialContactValue = {};

interface Props {
  shareholderId: number;
  contact?: ContactDto;
  open: boolean;
  onClose: () => void;
  onSubmit: (contact: ContactDto) => void;
}
export const ContactDialog = ({
  shareholderId,
  contact,
  open,
  onSubmit,
  onClose,
}: Props) => {
  const handleSubmit = useCallback(
    async (values: ContactDto) => {
      await onSubmit(values);
    },
    [onSubmit]
  );

  const contactTypeOptions = useMemo(
    () =>
      Object.keys(ContactTypeLookup).map<SelectOption>((key) => ({
        label: (ContactTypeLookup as any)[+key],
        value: +key,
      })),
    []
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
        initialValues={{ ...initialContactValue, shareholderId, ...contact }}
        enableReinitialize={true}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange={true}
      >
        {({ values }) => {
          const isPhoneContact = [
            ContactType.CellPhone,
            ContactType.WorkPhone,
            ContactType.HomePhone,
            ContactType.Fax,
          ].some((t) => t === values.type);
          return (
            <Form>
              <DialogHeader
                title={!contact ? "New Contact" : "Edit Contact"}
                onClose={onClose}
              />
              <DialogContent dividers={true} sx={{ width: 600 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormSelectField
                      name="type"
                      type="number"
                      placeholder="Contact Type"
                      label="Contact Type"
                      options={contactTypeOptions}
                    />
                  </Grid>
                  {!isPhoneContact && (
                    <Grid item xs={12}>
                      <FormTextField
                        name="value"
                        type="text"
                        placeholder="Value"
                        label="Value"
                      />
                    </Grid>
                  )}
                  {isPhoneContact && (
                    <Grid item xs={12}>
                      <FormPhoneNumber name="value" />
                    </Grid>
                  )}
                  <Grid item xs={12}></Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="primary" variant="outlined" type="submit">
                  Save
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
};
