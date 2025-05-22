import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import {
  AddDividendSetupCommand,
  DividendSetupDto,
  UpdateDividendSetupCommand,
  useAddNewDividendSetupMutation,
  useUpdateDividendSetupMutation,
} from "../../app/api";
import { Errors, FormCheckbox, FormTextField } from "../../components";
import { useCurrentDividendPeriod, usePermission } from "../../hooks";
import { YupShape, removeEmptyFields } from "../../utils";
import { formatNumber } from "../common";
import { useDividendPeriods } from "./useDividendPeriods";
import { useDividendSetups } from "./useDividendSetups";

const validationSchema = yup.object<
  YupShape<DividendSetupDto & { allocateDeclaredAmount?: boolean }>
>({
  id: yup.number().optional(),
  dividendPeriodId: yup.number().required(),
  declaredAmount: yup
    .number()
    // .min(0, "Declared Amount should be a positive number")
    .required("Declared Amount is required")
    .positive("Declared Amount should be a positive number"),
  additionalAllocationAmount: yup
    .number()
    .min(0, "Additional Allocation Amount should be a positive number")
    .required("Additional Allocation Amount"),
  taxRate: yup
    .number()
    .positive("Tax Rate should be a positive number")
    .required("Tax Rate is required")
    .max(100, "Cannot be more than 100"),
  dividendTaxDueDate: yup
    .date()
    .nullable()
    // .required("Dividend Tax Due Date is required")
    .test("", (value, { createError }) => {
      return !value || (!!value && dayjs().isBefore(value))
        ? true
        : createError({
            message: `Should be future date`,
            path: "dividendTaxDueDate",
          });
    }),
  description: yup.string().nullable().optional(),
});

const initialDividendSetupValue = {
  id: "",
  dividendPeriodId: "",
  declaredAmount: "",
  additionalAllocationAmount: "",
  taxRate: 10,
  description: "",
  dividendTaxDueDate: "",
} as any;

interface Props {
  setup?: DividendSetupDto;
  open: boolean;
  onClose: () => void;
}
export const DividendSetupDialog = ({ setup, open, onClose }: Props) => {
  const [setupData, setSetupData] = useState<
    DividendSetupDto & { allocateDeclaredAmount?: boolean }
  >();

  const { dividendPeriods, getDividendPeriodLookup } = useDividendPeriods();
  const { dividendSetups } = useDividendSetups();
  const { currentDividendPeriod } = useCurrentDividendPeriod();

  const [add, { error: addError }] = useAddNewDividendSetupMutation();
  const [update, { error: updateError }] = useUpdateDividendSetupMutation();

  const { canCreateOrUpdateDividendSetup } = usePermission();

  useEffect(() => {
    let dividendPeriodId = setup?.dividendPeriodId;
    if (!dividendPeriodId) {
      const previousSetup = dividendSetups.length && dividendSetups[0];
      if (previousSetup) {
        const dividendPeriod = dividendPeriods.filter((d) =>
          d.startDate.isAfter(previousSetup.dividendPeriodEndDate)
        )[0];
        dividendPeriodId = dividendPeriod.id;
      } else if (currentDividendPeriod) {
        const previousDividendPeriodIndex =
          dividendPeriods.findIndex((x) => x.id === currentDividendPeriod.id) -
          1;
        if (previousDividendPeriodIndex >= 0) {
          dividendPeriodId = dividendPeriods[previousDividendPeriodIndex].id;
        }
      }
    }

    const initValue = {
      ...initialDividendSetupValue,
      ...setup,
      dividendPeriodId,
    };
    initValue.allocateDeclaredAmount =
      initValue.declaredAmount === initValue.additionalAllocationAmount;

    setSetupData(initValue);
  }, [currentDividendPeriod, dividendPeriods, dividendSetups, setup]);

  const handleSubmit = useCallback(
    async (data: DividendSetupDto) => {
      const payload: UpdateDividendSetupCommand | AddDividendSetupCommand = {
        dividendPeriodId: data.dividendPeriodId,
        declaredAmount: data.declaredAmount,
        additionalAllocationAmount: data.additionalAllocationAmount,
        taxRate: data.taxRate,
        description: data.description?.trim(),
        id: data.id,

        dividendTaxDueDate:
          data.dividendTaxDueDate &&
          dayjs(data.dividendTaxDueDate).format("YYYY-MM-DD"),
      };

      (!data.id
        ? add({
            addDividendSetupCommand: removeEmptyFields(payload),
          })
        : update({
            updateDividendSetupCommand: removeEmptyFields(payload),
          })
      )
        .unwrap()
        .then(() => {
          onClose();
        })
        .catch(() => {});
    },
    [add, onClose, update]
  );

  if (!open || !setupData?.dividendPeriodId) {
    return null;
  }

  const errors = ((addError || updateError) as any)?.data?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={open}
    >
      <Formik
        initialValues={setupData}
        enableReinitialize={true}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange={true}
      >
        {({ values, errors: _errors, setValues }) => {
          if (
            values.allocateDeclaredAmount &&
            values.declaredAmount !== values.additionalAllocationAmount
          ) {
            setValues({
              ...values,
              additionalAllocationAmount: values.declaredAmount,
            });
          }

          return (
            <Form>
              <DialogTitle sx={{ m: 0, p: 2 }}>
                {!setupData?.id ? "New Dividend Setup" : "Edit Dividend Setup"}
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
                  {errors && (
                    <Grid item xs={12}>
                      <Errors errors={errors as any} />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      Dividend Period:{" "}
                      <Typography variant="subtitle2" component="span">
                        {getDividendPeriodLookup(setupData?.dividendPeriodId)
                          ?.label || ""}{" "}
                      </Typography>
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <FormTextField
                      name="declaredAmount"
                      type="number"
                      placeholder="Declared Amount (ETB)"
                      label="Declared Amount (ETB)"
                    />
                  </Grid>
                  {
                    <Grid item xs={12} sx={{ mt: -2 }}>
                      <Box>
                        <FormCheckbox
                          name="allocateDeclaredAmount"
                          label={
                            <Typography variant="subtitle2">
                              {" "}
                              Increase Dividend Allocation by{" "}
                              <Typography
                                component={"span"}
                                color="info.main"
                                variant="subtitle2"
                              >
                                {formatNumber(values.declaredAmount, 2)} ETB.
                              </Typography>
                            </Typography>
                          }
                        />
                      </Box>
                      {!values.allocateDeclaredAmount && (
                        <Box sx={{ py: 2, pl: 4 }}>
                          <FormTextField
                            name="additionalAllocationAmount"
                            type="number"
                            placeholder="Amount to add to Dividend Allocation (ETB)"
                            label="Amount to add to Dividend Allocation (ETB)"
                          />
                        </Box>
                      )}
                    </Grid>
                  }

                  <Grid item xs={12}>
                    <FormTextField
                      name="taxRate"
                      type="number"
                      placeholder="Tax Rate (%)"
                      label="Tax Rate (%)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <FormTextField
                        sx={{ flex: 1 }}
                        name="dividendTaxDueDate"
                        type="date"
                        label="Dividend Tax Due Date"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <FormTextField
                      name="description"
                      type="text"
                      placeholder="Description"
                      label="Description"
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
                  disabled={!canCreateOrUpdateDividendSetup}
                >
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
