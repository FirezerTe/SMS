import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  InputAdornment,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import { BankAllocationDto, useSetBankAllocationMutation } from "../../app/api";
import { DialogHeader, Errors, FormTextField } from "../../components";
import { usePermission } from "../../hooks";
import { YupShape, removeEmptyFields } from "../../utils";

const validationSchema = yup.object<YupShape<BankAllocationDto>>({
  amount: yup.number().required("Amount is required"),
  name: yup.string().required("Name is required"),
  description: yup.string().optional(),
  maxPercentagePurchaseLimit: yup.number().optional(),
});

const emptyBankAllocationData = {
  amount: "",
  name: "",
  description: "",
  maxPercentagePurchaseLimit: 5,
} as any;

export const BankAllocationDialog = ({
  title,
  bankAllocation,
  onClose,
}: {
  title: string;
  bankAllocation?: BankAllocationDto;
  onClose: () => void;
}) => {
  const [bankAllocationData, setBankAllocationData] =
    useState<BankAllocationDto>();
  const [saveBankAllocation, { error: saveBankAllocationError }] =
    useSetBankAllocationMutation();
  const { canCreateOrUpdateBankAllocation } = usePermission();

  useEffect(() => {
    setBankAllocationData({
      ...emptyBankAllocationData,
      ...bankAllocation,
    });
  }, [bankAllocation]);

  const handleSubmit = useCallback(
    (value: BankAllocationDto) => {
      const { id, amount, name, description, maxPercentagePurchaseLimit } =
        value;

      const data = removeEmptyFields({
        id,
        amount,
        name,
        description,
        maxPercentagePurchaseLimit,
      });
      saveBankAllocation({
        setBankAllocationCommand: data,
      })
        .unwrap()
        .then(onClose)
        .catch(() => {});
    },
    [saveBankAllocation, onClose]
  );

  const errors = (saveBankAllocationError as any)?.data?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!bankAllocationData && (
        <Formik
          initialValues={bankAllocationData}
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
                    name="maxPercentagePurchaseLimit"
                    type="number"
                    placeholder="Max Purchase Limit"
                    label="Max Purchase Limit"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">%</InputAdornment>
                      ),
                    }}
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
                disabled={!canCreateOrUpdateBankAllocation}
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
