import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  InputAdornment,
} from "@mui/material";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import {
  SubscriptionGroupInfo,
  useCreateSubscriptionGroupMutation,
  useUpdateSubscriptionGroupMutation,
} from "../../app/api";
import { PaymentUnit } from "../../app/api/enums";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
} from "../../components";
import { usePermission } from "../../hooks";
import { YupShape, removeEmptyFields } from "../../utils";
import { useAllocations } from "../Allocation";
import { SubscriptionGroupPremiumFormField } from "./SubscriptionGroupPremiumFormField";

const validationSchema = yup.object<YupShape<SubscriptionGroupInfo>>({
  allocationID: yup.number().required("Allocation is required"),
  name: yup.string().required("Subscription Group Name is required"),
  description: yup.string().required("Description is required"),
});

const defaultValues: SubscriptionGroupInfo = {
  minFirstPaymentAmount: 25,
  minFirstPaymentAmountUnit: PaymentUnit.Percentage,
  expireDate: "",
  name: "",
  minimumSubscriptionAmount: 30000,
  description: "",
  subscriptionPremium: {
    ranges: [
      {
        upperBound: 300000,
        percentage: 15,
      },
      {
        upperBound: null,
        percentage: 10,
      },
    ],
  },
};

export const SubscriptionGroupDialog = ({
  subscriptionGroup,
  open = false,
  onClose,
}: {
  subscriptionGroup: SubscriptionGroupInfo;
  open: boolean;
  onClose: () => void;
}) => {
  const [subscriptionGroupInfo, setSubscriptionGroupInfo] =
    useState<SubscriptionGroupInfo>();

  const { approvedAllocationLookups } = useAllocations();
  const [add, { error: addError }] = useCreateSubscriptionGroupMutation();
  const [update, { error: updateError }] = useUpdateSubscriptionGroupMutation();
  const permissions = usePermission();

  useEffect(() => {
    setSubscriptionGroupInfo({
      ...defaultValues,
      ...subscriptionGroup,
      allocationID: (subscriptionGroup.allocationID ||
        approvedAllocationLookups?.[0]?.value ||
        "") as any,
      subscriptionPremium: subscriptionGroup.id
        ? subscriptionGroup.subscriptionPremium
        : defaultValues.subscriptionPremium,
    });
  }, [subscriptionGroup, approvedAllocationLookups]);

  const paymentUnitOptions = useMemo(
    () => [
      {
        label: "% of subscription",
        value: PaymentUnit.Percentage,
      },
      {
        label: "Birr",
        value: PaymentUnit.Birr,
      },
    ],
    []
  );

  const handleSubmit = useCallback(
    async (values: SubscriptionGroupInfo) => {
      const payload = removeEmptyFields({
        ...values,
        expireDate:
          values.expireDate && dayjs(values.expireDate).format("YYYY-MM-DD"),
      });
      (!subscriptionGroup?.id
        ? add({
            createSubscriptionGroupCommand: {
              subscriptionGroup: payload,
            },
          })
        : update({
            updateSubscriptionGroupCommand: { subscriptionGroup: payload },
          })
      )
        .unwrap()
        .then(onClose)
        .catch(() => {});
    },
    [add, onClose, subscriptionGroup?.id, update]
  );

  const errors = ((addError || updateError) as any)?.data?.errors;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={open}
    >
      {!!subscriptionGroupInfo && (
        <Formik
          initialValues={subscriptionGroupInfo}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
        >
          {() => {
            return (
              <Form>
                <DialogHeader
                  title={`${
                    (!subscriptionGroup?.id && "New") || "Edit"
                  } Subscription Group`}
                  onClose={onClose}
                />
                <DialogContent dividers={true}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        {errors && (
                          <Grid item xs={12}>
                            <Errors errors={errors as any} />
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          <FormSelectField
                            name="allocationID"
                            type="number"
                            placeholder="Allocation"
                            label="Allocation"
                            options={approvedAllocationLookups}
                            autoComplete="allocationID"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormTextField
                            name="name"
                            type="text"
                            placeholder="Subscription Group Name"
                            label="Subscription Group Name"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: "flex" }}>
                            <FormTextField
                              name="expireDate"
                              type="date"
                              placeholder="End Date"
                              label="End Date"
                              sx={{ flex: 1 }}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <FormTextField
                            name="minimumSubscriptionAmount"
                            type="number"
                            placeholder="Minimum Subscription Amount"
                            label="Minimum Subscription Amount"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <FormTextField
                              name="minFirstPaymentAmount"
                              type="number"
                              placeholder="Minimum First Payment Amount"
                              label="Minimum First Payment Amount"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <FormSelectField
                                      name="minFirstPaymentAmountUnit"
                                      type="number"
                                      placeholder="Unit"
                                      label=""
                                      options={paymentUnitOptions}
                                      variant="standard"
                                    />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <SubscriptionGroupPremiumFormField name="subscriptionPremium" />
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
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button
                    color="primary"
                    variant="outlined"
                    type="submit"
                    disabled={!permissions.canCreateOrUpdateSubscriptionGroup}
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
