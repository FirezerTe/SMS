import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import {
  AddSubscriptionCommand,
  ParValueDto,
  ShareholderSubscriptionDto,
  SubscriptionGroupInfo,
  UpdateSubscriptionCommand,
  useAddSubscriptionMutation,
  useAttachPremiumPaymentReceiptMutation,
  useAttachSubscriptionFormMutation,
  useUpdateSubscriptionMutation,
} from "../../app/api";
import {
  DialogHeader,
  DocumentDownload,
  DocumentUpload,
  Errors,
  FormSelectField,
  FormTextField,
} from "../../components";

import * as yup from "yup";
import { PaymentUnit } from "../../app/api/enums";
import { usePermission } from "../../hooks";
import { YupShape, removeEmptyFields } from "../../utils";
import { useBranches } from "../Branch";
import { useDistricts } from "../District";
import { useParValue } from "../ParValue";
import { useSubscriptionGroups } from "../SubscriptionGroup";
import { formatNumber } from "../common";
import { useAlert } from "../notification";
import { useShareholderIdAndVersion } from "../shareholder";
import { useCurrentVersion } from "../shareholder/useCurrentVersion";
import { useApplicableSubscriptionGroupLookups } from "./useApplicableSubscriptionGroupLookups";
import { useShareholderSubscriptions } from "./useShareholderSubscriptions";
import { useSubscriptionDocuments } from "./useSubscriptionDocuments";

const validationSchema = (
  subscriptionGroups: SubscriptionGroupInfo[],
  parValue: ParValueDto,
  hasApprovedSubscription: boolean
) =>
  yup.object<YupShape<ShareholderSubscriptionDto>>({
    subscriptionDate: yup.date().nullable().required("Date is required"),
    subscriptionPaymentDueDate: yup
      .date()
      .nullable()
      .required("Subscription Payment Due Date is required")
      .test("", (value, { createError, parent }) => {
        if (!value || !parent.subscriptionDate) return true;

        const isBeforeSubscriptionDate = dayjs(value).isBefore(
          dayjs(parent.subscriptionDate)
        );

        return !isBeforeSubscriptionDate
          ? true
          : createError({
              message: `Subscription Payment Due Date must be after Subscription Date`,
              path: "subscriptionPaymentDueDate",
            });
      }),
    subscriptionGroupID: yup
      .number()
      .required("Subscription Group is required"),
    subscriptionDistrictID: yup.number().required("District Group is required"),
    subscriptionBranchID: yup.number().required("Branch Group is required"),
    premiumPaymentReceiptNo: yup
      .string()
      .nullable()
      .test("", (value, { createError }) => {
        return hasApprovedSubscription || !!(value || "").trim()
          ? true
          : createError({
              message: "Premium Payment Receipt # is required",
              path: "premiumPaymentReceiptNo",
            });
      }),
    amount: yup
      .number()
      .required("Amount is required")
      .when("subscriptionGroupID", ([subscriptionGroupID], yup) => {
        const selectedSubscriptionGroup = subscriptionGroups?.find(
          (s) => s.id == subscriptionGroupID
        );
        const minimumSubscription =
          selectedSubscriptionGroup?.minimumSubscriptionAmount || 0;

        return yup.min(
          minimumSubscription,
          `Should be at least minimum subscription amount (${minimumSubscription} ETB)`
        );
      })
      .test("", (value, { createError }) => {
        return !!parValue?.amount && value % parValue.amount
          ? createError({
              message: `Amount must be multiple of single share value (${parValue.amount} ETB)`,
              path: "amount",
            })
          : true;
      }),
  });

const emptySubscriptionData = {
  amount: "",
  subscriptionDate: dayjs(),
  subscriptionPaymentDueDate: "",
  shareholderId: "",
  subscriptionGroupID: "",
  subscriptionDistrictID: "",
  subscriptionBranchID: "",
  subscriptionOriginalReferenceNo: "",
  premiumPaymentReceiptNo: "",
} as any;

export const ShareholderSubscriptionDialog = ({
  title,
  subscription,
  onClose,
}: {
  title: string;
  subscription?: ShareholderSubscriptionDto;
  onClose: () => void;
}) => {
  const [subscriptionData, setSubscriptionData] =
    useState<ShareholderSubscriptionDto>();

  const { id: shareholderId } = useShareholderIdAndVersion();
  const { loadCurrentVersion } = useCurrentVersion();

  const { premiumPaymentReceipt, subscriptionForm } = useSubscriptionDocuments(
    shareholderId,
    subscription?.id
  );

  const { subscriptionGroups, computePremiumPayment } = useSubscriptionGroups();

  const { applicableSubscriptionGroupLookups } =
    useApplicableSubscriptionGroupLookups();
  const { currentParValue } = useParValue();

  const { branchLookups } = useBranches();
  const { districtLookups } = useDistricts();

  const [addNewSubscription, { error: newPaymentError }] =
    useAddSubscriptionMutation();
  const [updateSubscription, { error: updatePaymentError }] =
    useUpdateSubscriptionMutation();
  const permissions = usePermission();

  const [attachPremiumPaymentReceipt] =
    useAttachPremiumPaymentReceiptMutation();

  const [attachSubscriptionForm] = useAttachSubscriptionFormMutation();

  const { showSuccessAlert, showErrorAlert } = useAlert();

  const { hasApprovedSubscription } = useShareholderSubscriptions();

  useEffect(() => {
    setSubscriptionData({
      ...emptySubscriptionData,
      ...subscription,
      subscriptionGroupID:
        subscription?.subscriptionGroupID || subscriptionGroups?.[0].id,
    });
  }, [subscription, subscriptionGroups]);

  const handleSubmit = useCallback(
    (value: ShareholderSubscriptionDto) => {
      const data: UpdateSubscriptionCommand | AddSubscriptionCommand = {
        id: value.id,
        amount: value.amount,
        subscriptionDate: dayjs(value.subscriptionDate).format("YYYY-MM-DD"),
        subscriptionPaymentDueDate: dayjs(
          value.subscriptionPaymentDueDate
        ).format("YYYY-MM-DD"),
        shareholderId: value.shareholderId || shareholderId,
        subscriptionGroupID: value.subscriptionGroupID,
        subscriptionDistrictID: value.subscriptionDistrictID || undefined,
        subscriptionBranchID: value.subscriptionBranchID || undefined,
        subscriptionOriginalReferenceNo: value.subscriptionOriginalReferenceNo,
        premiumPaymentReceiptNo: value.premiumPaymentReceiptNo,
      };

      ((data as any)?.id
        ? updateSubscription({
            updateSubscriptionCommand: removeEmptyFields(data),
          })
        : addNewSubscription({
            addSubscriptionCommand: removeEmptyFields(data),
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
      addNewSubscription,
      loadCurrentVersion,
      onClose,
      shareholderId,
      updateSubscription,
    ]
  );

  const uploadPaymentRecept = useCallback(
    async (files: any[]) => {
      if (subscription?.id && files?.length) {
        attachPremiumPaymentReceipt({
          body: {
            subscriptionId: subscription.id,
            file: files[0],
          },
        })
          .then(() => {
            showSuccessAlert("Receipt uploaded");
          })
          .catch(() => {
            showErrorAlert("Error occurred");
          });
      }
    },
    [
      attachPremiumPaymentReceipt,
      showErrorAlert,
      showSuccessAlert,
      subscription,
    ]
  );

  const uploadSubscriptionForm = useCallback(
    async (files: any[]) => {
      if (subscription?.id && files?.length) {
        attachSubscriptionForm({
          body: {
            subscriptionId: subscription.id,
            file: files[0],
          },
        })
          .then(() => {
            showSuccessAlert("Form uploaded");
          })
          .catch(() => {
            showErrorAlert("Error occurred");
          });
      }
    },
    [attachSubscriptionForm, showErrorAlert, showSuccessAlert, subscription]
  );

  const errors = ((newPaymentError || updatePaymentError) as any)?.data?.errors;

  const renderForm = !!(
    subscriptionData &&
    subscriptionGroups?.length &&
    currentParValue
  );

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      fullWidth
      maxWidth={"md"}
      open={true}
    >
      {renderForm && (
        <Formik
          initialValues={subscriptionData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema(
            subscriptionGroups || [],
            currentParValue,
            hasApprovedSubscription
          )}
          validateOnChange={true}
        >
          {({ values }) => {
            const selectedSubscriptionGroup = subscriptionGroups?.find(
              (s) => s.id == values.subscriptionGroupID
            );

            const premiumPaymentAmount = computePremiumPayment(
              values.amount || 0,
              selectedSubscriptionGroup?.id || 0
            );

            const minFirstPayment =
              selectedSubscriptionGroup?.minFirstPaymentAmountUnit ===
              PaymentUnit.Percentage
                ? ((selectedSubscriptionGroup?.minFirstPaymentAmount || 0) *
                    (values.amount || 0)) /
                  100
                : selectedSubscriptionGroup?.minFirstPaymentAmount;

            return (
              <Form>
                <DialogHeader title={`${title}`} onClose={onClose} />
                <DialogContent dividers={true}>
                  <Grid container spacing={2}>
                    {errors && (
                      <Grid item xs={12}>
                        <Errors errors={errors as any} />
                      </Grid>
                    )}
                    {selectedSubscriptionGroup && (
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="subtitle2">
                              Subscription Form
                            </Typography>
                            {!!subscriptionForm?.documentId && (
                              <DocumentDownload
                                documentId={subscriptionForm.documentId}
                                label={
                                  subscriptionForm.fileName ||
                                  "subscription form"
                                }
                              />
                            )}
                            <DocumentUpload
                              onAdd={uploadSubscriptionForm}
                              label={`${
                                (subscriptionForm?.documentId && "Change") ||
                                "Attach"
                              } Form`}
                              disabled={!subscription?.id}
                              showIcon={true}
                              size="small"
                            />
                          </Box>
                          <Typography variant="subtitle2">
                            Minimum Subscription Amount:{" "}
                            <Typography
                              component={"span"}
                              variant="subtitle1"
                              color="info.main"
                            >
                              {`${formatNumber(
                                selectedSubscriptionGroup.minimumSubscriptionAmount ||
                                  0
                              )} ETB`}
                            </Typography>
                          </Typography>
                          <Typography variant="subtitle2">
                            Minimum First Payment:{" "}
                            <Typography
                              component={"span"}
                              variant="subtitle1"
                              color="info.main"
                            >
                              {`${formatNumber(minFirstPayment || 0)} ETB`}
                            </Typography>
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="subtitle2">
                              Premium Payment:{" "}
                              <Typography
                                component={"span"}
                                variant="subtitle1"
                                color="info.main"
                              >
                                {!hasApprovedSubscription
                                  ? `${formatNumber(
                                      premiumPaymentAmount || 0,
                                      4
                                    )} ETB`
                                  : "NA"}
                              </Typography>
                            </Typography>
                            {!!premiumPaymentReceipt?.documentId && (
                              <DocumentDownload
                                documentId={premiumPaymentReceipt.documentId}
                                label={
                                  premiumPaymentReceipt.fileName || "Receipt"
                                }
                              />
                            )}
                            {!hasApprovedSubscription && (
                              <DocumentUpload
                                onAdd={uploadPaymentRecept}
                                label={`${
                                  (premiumPaymentReceipt?.documentId &&
                                    "Change") ||
                                  "Attach"
                                } Receipt`}
                                disabled={!subscription?.id}
                                showIcon={true}
                                size="small"
                              />
                            )}
                          </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <FormSelectField
                        name="subscriptionGroupID"
                        type="number"
                        placeholder="Subscription Group"
                        label="Subscription Group"
                        options={applicableSubscriptionGroupLookups}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        name="amount"
                        type="number"
                        placeholder="Subscription Amount"
                        label="Subscription Amount"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <FormTextField
                          sx={{ flex: 1 }}
                          name="subscriptionDate"
                          type="date"
                          label="Subscription Date"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <FormTextField
                          sx={{ flex: 1 }}
                          name="subscriptionPaymentDueDate"
                          type="date"
                          label="Subscription Payment Due Date"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <FormSelectField
                        name="subscriptionDistrictID"
                        type="number"
                        placeholder="District"
                        label="District"
                        options={districtLookups}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormSelectField
                        name="subscriptionBranchID"
                        type="number"
                        placeholder="Branch"
                        label="Branch"
                        options={branchLookups}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormTextField
                        name="subscriptionOriginalReferenceNo"
                        type="text"
                        placeholder="Reference #"
                        label="Reference #"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        name="premiumPaymentReceiptNo"
                        type="text"
                        placeholder="Premium Payment Receipt #"
                        label="Premium Payment Receipt #"
                        disabled={hasApprovedSubscription}
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
                    disabled={!permissions.canCreateOrUpdateSubscription}
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
