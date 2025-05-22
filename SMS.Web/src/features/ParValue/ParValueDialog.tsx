import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import {
  ParValueDto,
  useCreateParValueMutation,
  useUpdateParValueMutation,
} from "../../app/api";
import { DialogHeader, Errors, FormTextField } from "../../components";
import { usePermission } from "../../hooks";
import { YupShape, removeEmptyFields } from "../../utils";

const validationSchema = yup.object<YupShape<ParValueDto>>({
  amount: yup.number().moreThan(0).required("Amount is required"),
  name: yup.string().required("Name is required"),
  description: yup.string().optional(),
});

const emptyParValueData = {
  amount: "",
  name: "",
  description: "",
} as any;

export const ParValueDialog = ({
  title,
  parValue,
  onClose,
}: {
  title: string;
  parValue?: ParValueDto;
  onClose: () => void;
}) => {
  const [parValueData, setParValueData] = useState<ParValueDto>();
  const [updateParValue, { error: updateParValueError }] =
    useUpdateParValueMutation();
  const [addParValue, { error: addParValueError }] =
    useCreateParValueMutation();
  const { canCreateOrUpdateParValue } = usePermission();

  useEffect(() => {
    setParValueData({
      ...emptyParValueData,
      ...parValue,
    });
  }, [parValue]);

  const handleSubmit = useCallback(
    (value: ParValueDto) => {
      const { id, amount, name, description } = value;

      const data = removeEmptyFields({
        id,
        amount,
        name,
        description,
      });
      (parValue?.id
        ? updateParValue({
            updateParValueCommand: data,
          })
        : addParValue({
            createParValueCommand: data,
          })
      )
        .unwrap()
        .then(onClose)
        .catch(() => {});
    },
    [addParValue, onClose, parValue?.id, updateParValue]
  );

  const errors = ((updateParValueError || addParValueError) as any)?.data
    ?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!parValueData && (
        <Formik
          initialValues={parValueData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
        >
          <Form>
            <DialogHeader title={title} onClose={onClose} />
            <DialogContent dividers={true}>
              <Grid container spacing={2}>
                {errors && (
                  <Grid item xs={12}>
                    <Errors errors={errors as any} />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormTextField
                    name="amount"
                    type="number"
                    placeholder="Amount"
                    label="Amount"
                  />
                </Grid>
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
                    name="description"
                    type="text"
                    placeholder="Description"
                    label="Description"
                    fullWidth
                    multiline
                    minRows={5}
                    variant="outlined"
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
                disabled={!canCreateOrUpdateParValue}
              >
                Save
              </Button>
            </DialogActions>
          </Form>
        </Formik>
      )}
    </Dialog>
  );
};
