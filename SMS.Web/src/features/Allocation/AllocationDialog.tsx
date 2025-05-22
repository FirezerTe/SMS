import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import {
  AllocationDto,
  useCreateAllocationMutation,
  useUpdateAllocationMutation,
} from "../../app/api";
import {
  DialogHeader,
  Errors,
  FormCheckbox,
  FormTextField,
} from "../../components";
import { usePermission } from "../../hooks";
import { YupShape, removeEmptyFields } from "../../utils";

const validationSchema = yup.object<YupShape<AllocationDto>>({
  amount: yup.number().required("Amount is required"),
  name: yup.string().required("Name is required"),
  description: yup.string().optional(),
  isOnlyForExistingShareholders: yup.boolean(),
  fromDate: yup
    .date()
    .nullable()
    .default(null)
    .required("From Date is required"),
  toDate: yup
    .date()
    .nullable()
    .optional()
    .default(null)
    .when("fromDate", ([fromDate], yup) => {
      return (
        (fromDate &&
          yup.min(fromDate, "To Date must be later than From Date")) ||
        yup
      );
    }),
});

const emptyAllocationData = {
  amount: "",
  name: "",
  description: "",
  fromDate: "",
  toDate: "",
  isOnlyForExistingShareholders: false,
} as any;

export const AllocationDialog = ({
  title,
  allocation,
  onClose,
}: {
  title: string;
  allocation?: AllocationDto;
  onClose: () => void;
}) => {
  const [allocationData, setAllocationData] = useState<AllocationDto>();
  const [updateAllocation, { error: updateAllocationError }] =
    useUpdateAllocationMutation();
  const [addAllocation, { error: addAllocationError }] =
    useCreateAllocationMutation();
  const permissions = usePermission();

  useEffect(() => {
    setAllocationData({
      ...emptyAllocationData,
      ...allocation,
      isOnlyForExistingShareholders:
        !!allocation?.isOnlyForExistingShareholders,
    });
  }, [allocation]);

  const handleSubmit = useCallback(
    (value: AllocationDto) => {
      const fromDate = dayjs(value.fromDate).format("YYYY-MM-DD");
      const toDate = value.toDate && dayjs(value.toDate).format("YYYY-MM-DD");

      const payload = removeEmptyFields({ ...value, fromDate, toDate });

      (allocation?.id
        ? updateAllocation({
            updateAllocationCommand: payload,
          })
        : addAllocation({
            createAllocationCommand: { payload },
          })
      )
        .unwrap()
        .then(onClose)
        .catch(() => {});
    },

    [addAllocation, onClose, allocation?.id, updateAllocation]
  );

  const errors = ((updateAllocationError || addAllocationError) as any)?.data
    ?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!allocationData && (
        <Formik
          initialValues={allocationData}
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
                  <FormCheckbox
                    name="isOnlyForExistingShareholders"
                    label="Is only for existing shareholders?"
                  />
                </Grid>
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
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormTextField
                      sx={{ flex: 1 }}
                      name="fromDate"
                      type="date"
                      label="From Date"
                    />
                    <FormTextField
                      sx={{ flex: 1 }}
                      name="toDate"
                      type="date"
                      required={false}
                      placeholder="To Date"
                      label="To Date"
                    />
                  </Box>
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
                disabled={!permissions.canCreateOrUpdateAllocation}
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
