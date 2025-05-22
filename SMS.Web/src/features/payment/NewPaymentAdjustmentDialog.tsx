import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import {
  AddPaymentAdjustmentCommand,
  PaymentTypeEnum,
  SubscriptionPaymentDto,
  UpdatePaymentAdjustmentCommand,
  useAddNewAdjustmentMutation,
  useUpdatePaymentAdjustmentMutation,
} from "../../app/api";
import { PaymentType } from "../../app/api/enums";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
} from "../../components";
import { usePermission } from "../../hooks";
import { YupShape, removeEmptyFields } from "../../utils";
import { useBranches } from "../Branch";
import { useDistricts } from "../District";
import { formatNumber } from "../common";
import { usePaymentTypes } from "../paymentTypes";
import { useCurrentVersion } from "../shareholder/useCurrentVersion";

type Adjustment = {
  parentPaymentId?: number;
  amount?: number;
  paymentTypeEnum?: PaymentTypeEnum;
  branchId?: number | null;
  districtId?: number | null;
  note?: string | null;
};

const emptyAdjustment = {
  parentPaymentId: "",
  amount: "",
  paymentTypeEnum: "",
  branchId: "",
  districtId: "",
  note: "",
} as any;

const validationSchema = yup.object<YupShape<Adjustment>>({
  parentPaymentId: yup.number().required("Original Payment is required"),
  amount: yup.number().required("Amount is required"),
  paymentTypeEnum: yup.number().required("Adjustment Type is required"),
  branchId: yup.number().required("Branch is required"),
  districtId: yup.number().required("District is required"),
  note: yup.string().required("Adjustment Reason is required"),
});

export const NewPaymentAdjustmentDialog = ({
  onClose,
  payment,
  parentPayment,
}: {
  payment?: SubscriptionPaymentDto;
  parentPayment: SubscriptionPaymentDto;
  onClose: () => void;
}) => {
  const [adjustment, setAdjustment] = useState<Adjustment>();
  const [addNewAdjustment, { error: addAdjustmentErrors }] =
    useAddNewAdjustmentMutation();
  const { loadCurrentVersion } = useCurrentVersion();
  const permissions = usePermission();

  const [updateAdjustment, { error: updateAdjustmentErrors }] =
    useUpdatePaymentAdjustmentMutation();

  useEffect(() => {
    setAdjustment({
      ...emptyAdjustment,
      ...payment,
      parentPaymentId: parentPayment.id,
    });
  }, [parentPayment.id, payment]);

  const { branchLookups } = useBranches();
  const { districtLookups } = useDistricts();

  const { adjustmentPaymentTypeLookups } = usePaymentTypes();

  const handleSubmit = useCallback(
    async (value: Adjustment) => {
      const payload:
        | AddPaymentAdjustmentCommand
        | UpdatePaymentAdjustmentCommand = removeEmptyFields({
        paymentId: payment?.id,
        parentPaymentId: value.parentPaymentId,
        amount: value.amount,
        paymentType: value.paymentTypeEnum,
        branchId: value.branchId,
        districtId: value.districtId,
        note: value.note,
      });

      (payment?.id
        ? updateAdjustment({
            updatePaymentAdjustmentCommand: payload,
          })
        : addNewAdjustment({
            addPaymentAdjustmentCommand: payload,
          })
      )
        .unwrap()
        .then(() => {
          onClose();
          loadCurrentVersion();
        })
        .catch(() => {});
    },
    [
      addNewAdjustment,
      loadCurrentVersion,
      onClose,
      payment?.id,
      updateAdjustment,
    ]
  );

  const errors = ((addAdjustmentErrors || updateAdjustmentErrors) as any)?.data
    ?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      fullWidth
      maxWidth={"md"}
      open={true}
    >
      {adjustment && (
        <Formik
          initialValues={adjustment}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
        >
          {({ values, setValues }) => {
            const parentPaymentAmount = parentPayment?.amount || 0;
            const netPayment = parentPaymentAmount + (values.amount || 0);

            if (
              values.paymentTypeEnum == PaymentType.Reversal &&
              -1 * parentPaymentAmount !== values.amount
            ) {
              setValues({ ...values, amount: -1 * parentPaymentAmount });
            }

            return (
              <Form>
                <DialogHeader title={"Adjust Payment"} onClose={onClose} />
                <DialogContent dividers={true}>
                  <Grid container spacing={2} sx={{ mb: 5 }}>
                    {errors && (
                      <Grid item xs={12}>
                        <Errors errors={errors as any} />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <TableContainer sx={{ width: 300, pb: 2 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Payment</TableCell>
                              <TableCell align="right">Amount (ETB)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ width: 80 }}>Original</TableCell>
                              <TableCell align="right">
                                <Typography variant="subtitle2">
                                  {`${formatNumber(parentPayment?.amount)} `}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ width: 80 }}>
                                Adjustment
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="subtitle2">
                                  {`${formatNumber(values?.amount)} `}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                sx={{ borderBottomWidth: 0, width: 80 }}
                              >
                                <Typography variant="subtitle2">Net</Typography>
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{ borderBottomWidth: 0 }}
                              >
                                <Typography variant="subtitle2">
                                  {`${formatNumber(netPayment)} `}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>

                    <Grid item xs={12}>
                      <FormSelectField
                        name="paymentTypeEnum"
                        type="number"
                        placeholder="Adjustment Type"
                        label="Adjustment Type"
                        options={adjustmentPaymentTypeLookups}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormTextField
                        name="amount"
                        type="number"
                        placeholder="Adjustment Amount (ETB)"
                        label="Adjustment Amount (ETB)"
                        disabled={
                          values.paymentTypeEnum === PaymentType.Reversal
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormSelectField
                        name="districtId"
                        type="number"
                        placeholder="District"
                        label="District"
                        options={districtLookups}
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
                      <FormTextField
                        name="note"
                        type="text"
                        placeholder="Adjustment Reason"
                        label="Adjustment Reason"
                        fullWidth
                        multiline
                        minRows={3}
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
                    disabled={!permissions.canCreateOrUpdatePayment}
                  >
                    Save
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      )}
    </Dialog>
  );
};
