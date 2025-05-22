import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  NewPaymentDto,
  ParValueDto,
  SubscriptionPaymentDto,
  UpdateSubscriptionCommand,
  useMakePaymentMutation,
  useUpdatePaymentMutation,
} from "../../app/api";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
} from "../../components";

import dayjs from "dayjs";
import * as yup from "yup";
import {
  ApprovalStatus,
  PaymentMethod,
  PaymentType,
  ShareholderType,
} from "../../app/api/enums";
import { usePermission } from "../../hooks";
import { YupShape, removeEmptyFields } from "../../utils";
import { useBranches } from "../Branch";
import { useDistricts } from "../District";
import { useParValue } from "../ParValue";
import { useCountries } from "../countries";
import { useForeignCurrencies } from "../foreignCurrencies";
import { usePaymentMethods } from "../paymentMethods";
import { usePaymentTypes } from "../paymentTypes";
import { useCurrentShareholderInfo } from "../shareholder";
import { useCurrentVersion } from "../shareholder/useCurrentVersion";

const validationSchema = (
  currentParValue: ParValueDto,
  isForeignNational: boolean
) =>
  yup.object<YupShape<SubscriptionPaymentDto>>({
    amount: yup
      .number()
      .required("Amount is required")
      .test("", (value, { createError }) => {
        return !!currentParValue?.amount && value % currentParValue.amount
          ? createError({
              message: `Amount must be multiple of single share value (${currentParValue.amount} ETB)`,
              path: "amount",
            })
          : true;
      }),
    effectiveDate: yup.date().required("Payment date is required"),
    paymentTypeEnum: yup.number().required("Payment type is required"),
    paymentMethodEnum: yup.number().required("Payment Method is required"),
    branchId: yup.number().required("Branch is required"),
    districtId: yup.number().required("District is required"),
    paymentReceiptNo: yup.string().required("Payment Receipt #"),
    foreignCurrencyId: yup
      .number()
      .nullable()
      .test("", (value, { createError }) => {
        if (!isForeignNational) return true;
        if (!value) {
          return createError({
            message: `Payment Currency is required`,
            path: "foreignCurrencyId",
          });
        }
        if (value <= 0) {
          return createError({
            message: `Payment Currency should be positive`,
            path: "foreignCurrencyId",
          });
        }
        return true;
      }),
    foreignCurrencyAmount: yup
      .number()
      .nullable()
      .test("", (value, { createError }) => {
        if (!isForeignNational) return true;
        if (!value) {
          return createError({
            message: `Amount is required`,
            path: "foreignCurrencyAmount",
          });
        }
        if (value <= 0) {
          return createError({
            message: `Amount should be positive`,
            path: "foreignCurrencyAmount",
          });
        }
        return true;
      }),
  });

const emptySubscriptionPayment = {
  amount: "",
  effectiveDate: dayjs(),
  paymentTypeEnum: PaymentType.SubscriptionPayment,
  paymentMethodEnum: PaymentMethod.FromAccount,
  districtId: "",
  branchId: "",
  originalReferenceNo: "",
  paymentReceiptNo: "",
  note: "",
  foreignCurrencyId: "",
  foreignCurrencyAmount: "",
} as any;

export const SubscriptionPaymentDialog = ({
  onClose,
  payment,
  subscriptionId,
}: {
  subscriptionId: number;
  payment?: SubscriptionPaymentDto;
  onClose: () => void;
}) => {
  const [paymentData, setPaymentData] = useState<SubscriptionPaymentDto>();
  const { loadCurrentVersion } = useCurrentVersion();
  const { currentParValue } = useParValue();
  const { paymentTypeLookups } = usePaymentTypes();
  const { paymentMethodLookups } = usePaymentMethods();
  const { branchLookups } = useBranches();
  const { districtLookups } = useDistricts();
  const { defaultCountryId } = useCountries();
  const currentShareholder = useCurrentShareholderInfo();
  const { foreignCurrencies, foreignCurrencyLookups } = useForeignCurrencies();

  const [makeNewPayment, { error: newPaymentError }] = useMakePaymentMutation();
  const [updatePayment, { error: updatePaymentError }] =
    useUpdatePaymentMutation();
  const permissions = usePermission();

  useEffect(() => {
    setPaymentData({
      ...emptySubscriptionPayment,
      subscriptionId,
      ...payment,
    });
  }, [payment, subscriptionId]);

  const isForeignNational = useMemo(
    () => currentShareholder?.countryOfCitizenship !== defaultCountryId,
    [currentShareholder?.countryOfCitizenship, defaultCountryId]
  );

  const handleSubmit = useCallback(
    (value: SubscriptionPaymentDto) => {
      const paymentDate = dayjs(value.effectiveDate).format("YYYY-MM-DD");
      const paymentData: UpdateSubscriptionCommand | NewPaymentDto = {
        id: value.id,
        amount: value.amount,
        subscriptionId: value.subscriptionId,
        paymentDate,
        paymentType: value.paymentTypeEnum,
        paymentMethod: value.paymentMethodEnum,
        districtId: value.districtId,
        branchId: value.branchId,
        originalReferenceNo: value.originalReferenceNo,
        paymentReceiptNo: value.paymentReceiptNo,
        note: value.note,
        foreignCurrencyId: value.foreignCurrencyId,
        foreignCurrencyAmount: value.foreignCurrencyAmount,
      };

      const payment = removeEmptyFields(paymentData);

      ((payment as any)?.id
        ? updatePayment({
            updateSubscriptionPaymentCommand: payment,
          })
        : makeNewPayment({
            makeSubscriptionPaymentCommand: {
              payment,
            },
          })
      )
        .unwrap()
        .then(() => {
          onClose();
          loadCurrentVersion();
        })
        .catch(() => {});
    },
    [loadCurrentVersion, makeNewPayment, onClose, updatePayment]
  );

  const errors = ((newPaymentError || updatePaymentError) as any)?.data?.errors;
  const readOnly = payment?.approvalStatus === ApprovalStatus.Approved;
  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      fullWidth
      maxWidth={"md"}
      open={true}
    >
      {!!paymentData && currentParValue && (
        <Formik
          initialValues={paymentData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema(
            currentParValue,
            isForeignNational
          )}
          validateOnChange={true}
        >
          {({ values }) => {
            const selectedForeignCurrency = foreignCurrencies.find(
              (c) => c.id === values.foreignCurrencyId
            )?.name;
            return (
              <Form>
                <DialogHeader
                  title={paymentData.id ? `Update Payment` : "Make New Payment"}
                  onClose={onClose}
                />
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
                        placeholder="Payment Amount (ETB)"
                        label="Payment Amount (ETB)"
                        disabled={readOnly}
                      />
                    </Grid>
                    {currentShareholder?.shareholderType ==
                      ShareholderType.Individual &&
                      !!isForeignNational && (
                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <FormSelectField
                                name="foreignCurrencyId"
                                type="number"
                                placeholder="Payment Currency"
                                label="Payment Currency"
                                options={foreignCurrencyLookups}
                                disabled={readOnly}
                              />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <FormTextField
                                name="foreignCurrencyAmount"
                                type="number"
                                label={
                                  selectedForeignCurrency
                                    ? `Payment Amount in ${
                                        selectedForeignCurrency || ""
                                      }`
                                    : ""
                                }
                                disabled={readOnly || !selectedForeignCurrency}
                              />
                            </Box>
                          </Box>
                        </Grid>
                      )}
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <FormTextField
                          sx={{ flex: 1 }}
                          name="effectiveDate"
                          type="date"
                          label="Payment Date"
                          disabled={readOnly}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <FormSelectField
                        name="paymentTypeEnum"
                        type="number"
                        placeholder="Payment Type"
                        label="Payment Type"
                        options={paymentTypeLookups}
                        disabled={readOnly}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormSelectField
                        name="paymentMethodEnum"
                        type="number"
                        placeholder="Payment Method"
                        label="Payment Method"
                        options={paymentMethodLookups}
                        disabled={readOnly}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormSelectField
                        name="districtId"
                        type="number"
                        placeholder="District"
                        label="District"
                        options={districtLookups}
                        disabled={readOnly}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormSelectField
                        name="branchId"
                        type="number"
                        placeholder="Branch"
                        label="Branch"
                        options={branchLookups}
                        disabled={readOnly}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        name="paymentReceiptNo"
                        type="text"
                        placeholder="Payment Receipt #"
                        label="Payment Receipt #"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        name="originalReferenceNo"
                        type="text"
                        placeholder="Reference #"
                        label="Reference #"
                        disabled={readOnly}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        name="note"
                        type="text"
                        placeholder="Note"
                        label="Note"
                        fullWidth
                        multiline
                        minRows={3}
                        variant="outlined"
                        disabled={readOnly}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={onClose} disabled={readOnly}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    variant="outlined"
                    type="submit"
                    disabled={!permissions.canCreateOrUpdatePayment || readOnly}
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
