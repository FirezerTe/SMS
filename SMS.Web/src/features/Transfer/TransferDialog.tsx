import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import {
  AddNewTransferCommand,
  ShareholderBasicInfo,
  ShareholderSubscriptionsSummary,
  TransferDto,
  TransferredPaymentDto,
  UpdateTransferCommand,
  useCreateNewTransferMutation,
  useGetShareholderSubscriptionSummaryQuery,
  useUpdateTransferMutation,
} from "../../app/api";
import {
  ApprovalStatus,
  TransferDividendTerm,
  TransferType,
} from "../../app/api/enums";
import {
  DialogHeader,
  Errors,
  FormSearchShareholder,
  FormSelectField,
  FormTextField,
} from "../../components";
import { useCurrentDividendPeriod, usePermission } from "../../hooks";
import { YupShape, removeEmptyFields } from "../../utils";
import { useBranches } from "../Branch";
import { useDistricts } from "../District";
import { formatNumber } from "../common";
import { useAlert } from "../notification";
import { useShareholderIdAndVersion } from "../shareholder";
import { useCurrentVersion } from "../shareholder/useCurrentVersion";
import { ToShareholdersFormField } from "./ToShareholdersFormField";
import { useDividendTerms } from "./useDividendTerms";
import { useTransferTypes } from "./useTransferTypes";

export type Shareholder = ShareholderBasicInfo & { transferredAmount?: number };

interface TransferFormData {
  amount: number;
  fromShareholder: Shareholder;
  effectiveDate?: string;
  agreementDate: string;
  toShareholders: Shareholder[];
  branchId: number;
  districtId: number;
  note: string;
  transferType: TransferType;
  dividendTerm: TransferDividendTerm;
  sellValue?: number;
  capitalGainTax?: number;
  serviceCharge?: number;
}

const validationSchema = (
  subscriptionSummary?: ShareholderSubscriptionsSummary
) =>
  yup.object<YupShape<TransferFormData>>({
    amount: yup
      .number()
      .required("Amount is required")
      .test("", (value, { createError }) => {
        return !!subscriptionSummary?.totalApprovedPayments &&
          value > subscriptionSummary.totalApprovedPayments
          ? createError({
              message: `Cannot transfer more than total approved payments (${formatNumber(
                subscriptionSummary.totalApprovedPayments
              )} ETB)`,
              path: "amount",
            })
          : true;
      })
      .test("", (value, { createError }) => {
        return !subscriptionSummary?.totalApprovedPayments
          ? createError({
              message: `No approved payment available`,
              path: "amount",
            })
          : true;
      }),
    sellValue: yup
      .number()
      .nullable()
      .moreThan(0, "Sell Value should be positive number")
      .when("transferType", ([type], schema) => {
        return type === TransferType.Sale
          ? schema.required("Total Sell Value is required")
          : schema.optional();
      }),
    capitalGainTax: yup
      .number()
      .nullable()
      .moreThan(0, "Capital Gain Tax should be positive number")
      .when(
        ["transferType", "sellValue", "amount"],
        ([type, sellValue, amount], schema) => {
          return type === TransferType.Sale && (sellValue || 0) > (amount || 0)
            ? schema.required("Capital Gain Tax is required")
            : schema.optional();
        }
      ),
    fromShareholder: yup
      .object<Shareholder>()
      .nonNullable()
      .required("From Shareholder required"),
    toShareholders: yup
      .array<Shareholder>()
      .nonNullable()
      .min(1)
      .required("To Shareholders is required"),
    branchId: yup.number().required("Branch is required"),
    districtId: yup.number().required("District is required"),
    dividendTerm: yup.number().required("Dividend Term is required"),
    transferType: yup.number().required("Transfer Type is required"),
    effectiveDate: yup.date().nullable().required("Effective Date is required"),
  });

const emptyTransferInfo = {
  amount: "",
  fromShareholder: "",
  toShareholders: "",
  branchId: "",
  districtId: "",
  effectiveDate: dayjs().format("YYYY-MM-DD"),
  agreementDate: dayjs().format("YYYY-MM-DD"),
  note: "",
  dividendTerm: TransferDividendTerm.Shared,
  transferType: "",
  sellValue: "",
  capitalGainTax: "",
} as any;

export const TransferDialog = ({
  onClose,
  fromShareholder,
  disabled,
  transfer,
}: {
  transfer?: TransferDto;
  onClose: () => void;
  fromShareholder?: ShareholderBasicInfo;
  disabled?: boolean;
}) => {
  const [transferInfo, setTransferInfo] = useState<TransferFormData>();
  const { id: shareholderId } = useShareholderIdAndVersion();
  const { loadCurrentVersion } = useCurrentVersion();
  const permissions = usePermission();

  const { data: subscriptionSummary } =
    useGetShareholderSubscriptionSummaryQuery(
      {
        id: shareholderId,
      },
      { skip: !shareholderId }
    );

  const [createNewTransfer, { error: createNewTransferError }] =
    useCreateNewTransferMutation();

  const [updateTransfer, { error: updateTransferError }] =
    useUpdateTransferMutation();

  const [hasTransferError, setHasTransferError] = useState(false);
  const { showErrorAlert } = useAlert();
  const { branchLookups } = useBranches();
  const { districtLookups } = useDistricts();
  const { transferTypeLookups } = useTransferTypes();
  const { dividendTermLookups } = useDividendTerms();
  const { currentDividendPeriodStartDate, nextDividendPeriodStartDate } =
    useCurrentDividendPeriod();

  useEffect(() => {
    setTransferInfo({
      ...emptyTransferInfo,
      fromShareholder,
      ...(transfer
        ? {
            ...transfer,
            amount: transfer.totalTransferAmount,
            sellValue: transfer.sellValue,
            capitalGainTax: transfer.capitalGainTax,
            fromShareholder: transfer.fromShareholder,
            toShareholders: transfer.transferees?.map((t) => ({
              ...t.shareholder,
              transferredAmount: t.amount,
            })),
          }
        : {}),
    });
  }, [fromShareholder, transfer]);

  const totalTransferred = (data?: TransferFormData) =>
    data?.toShareholders.reduce(
      (v, t) => (v += +(t as any).transferredAmount || 0),
      0
    );

  const handleSubmit = useCallback(
    (value?: TransferFormData) => {
      if (!value) return;

      const transferred = totalTransferred(value);
      if (value.amount !== transferred) {
        setHasTransferError(true);
        return;
      } else if (hasTransferError) {
        setHasTransferError(false);
      }

      const payload: AddNewTransferCommand | UpdateTransferCommand = {
        transferId: transfer?.id,
        totalTransferAmount: value.amount,
        sellValue:
          value.transferType === TransferType.Sale
            ? value.sellValue
            : undefined,
        capitalGainTax:
          value.transferType === TransferType.Sale
            ? value.capitalGainTax
            : undefined,
        fromShareholderId: value.fromShareholder.id,
        serviceCharge: value.serviceCharge,
        effectiveDate:
          value.effectiveDate &&
          dayjs(value.effectiveDate).format("YYYY-MM-DD"),
        agreementDate:
          value.agreementDate &&
          dayjs(value.agreementDate).format("YYYY-MM-DD"),
        branchId: value.branchId,
        districtId: value.districtId,
        note: value.note,
        dividendTerm: value.dividendTerm,
        transferType: value.transferType,
        transferees: value.toShareholders.map<TransferredPaymentDto>(
          ({ id, transferredAmount }) => ({
            shareholderId: id,
            amount: transferredAmount,
          })
        ),
      };

      (transfer?.id
        ? updateTransfer({
            updateTransferCommand: removeEmptyFields(payload),
          })
        : createNewTransfer({
            addNewTransferCommand: removeEmptyFields(payload),
          })
      )
        .unwrap()
        .then(() => {
          onClose();
          loadCurrentVersion();
        })
        .catch(() => {
          showErrorAlert("Error occurred");
        });
    },
    [
      createNewTransfer,
      hasTransferError,
      loadCurrentVersion,
      onClose,
      showErrorAlert,
      transfer?.id,
      updateTransfer,
    ]
  );

  const errors = ((createNewTransferError || updateTransferError) as any)?.data
    ?.errors;

  const disableForm =
    !permissions.canCreateOrUpdateTransfer ||
    transfer?.approvalStatus === ApprovalStatus.Approved;

  const disableFromShareholder = !!(
    disableForm ||
    disabled ||
    fromShareholder?.id ||
    transfer?.fromShareholder?.id
  );

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      fullWidth
      maxWidth={"md"}
      open={true}
    >
      {!!transferInfo && !!dividendTermLookups?.length && (
        <Formik
          initialValues={transferInfo}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema(subscriptionSummary)}
          validateOnChange={true}
        >
          {({ values, setValues }) => {
            if (values.dividendTerm === TransferDividendTerm.FullToTransferor) {
              values.effectiveDate != nextDividendPeriodStartDate &&
                setValues({
                  ...values,
                  effectiveDate: nextDividendPeriodStartDate,
                });
            } else if (
              values.dividendTerm === TransferDividendTerm.FullToTransferee
            ) {
              values.effectiveDate != currentDividendPeriodStartDate &&
                setValues({
                  ...values,
                  effectiveDate: currentDividendPeriodStartDate,
                });
            }

            return (
              <Form>
                <DialogHeader
                  title={transfer?.id ? "Update Transfer" : "Add New Transfer"}
                  onClose={onClose}
                />
                <DialogContent dividers={true}>
                  <Grid container spacing={2}>
                    {hasTransferError && (
                      <Grid item xs={12}>
                        <Errors
                          errors={{
                            hasTransferError:
                              "Total transferred amount does not match with Amount to Transfer",
                          }}
                        />
                      </Grid>
                    )}
                    {errors && (
                      <Grid item xs={12}>
                        <Errors errors={errors as any} />
                      </Grid>
                    )}
                    <Grid item xs={6}>
                      <FormSelectField
                        name="transferType"
                        type="number"
                        placeholder="Transfer Type"
                        label="Transfer Type"
                        options={transferTypeLookups}
                        size="small"
                        disabled={disableForm}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <FormTextField
                          sx={{ flex: 1 }}
                          name="agreementDate"
                          type="date"
                          label="Agreement Signed On"
                          size="small"
                          disabled={disableForm}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <FormSelectField
                        name="dividendTerm"
                        type="number"
                        placeholder="Dividend Term"
                        label="Dividend Term"
                        options={dividendTermLookups}
                        size="small"
                        disabled={disableForm}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <FormTextField
                          sx={{ flex: 1 }}
                          name="effectiveDate"
                          type="date"
                          label="Transfer Effective Date"
                          size="small"
                          disabled={
                            disableForm ||
                            values.dividendTerm ===
                              TransferDividendTerm.FullToTransferee ||
                            values.dividendTerm ===
                              TransferDividendTerm.FullToTransferor
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider variant="fullWidth" />
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          px: 2,
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Typography variant="h6">From</Typography>

                        <FormSearchShareholder
                          name="fromShareholder"
                          label="From Shareholder"
                          size="small"
                          value={transferInfo.fromShareholder}
                          disabled={disableFromShareholder}
                        />
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <FormTextField
                              name="amount"
                              type="number"
                              placeholder="Total Amount to Transfer (ETB)"
                              label="Total Amount to Transfer (ETB)"
                              size="small"
                              disabled={disableForm}
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <FormTextField
                              name="serviceCharge"
                              type="number"
                              placeholder="Service Charge"
                              label="Service Charge"
                              size="small"
                              disabled={disableForm}
                            />
                          </Box>
                        </Box>
                        {values.transferType === TransferType.Sale && (
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <FormTextField
                                name="sellValue"
                                type="number"
                                placeholder="Total Sell Value"
                                label="Total Sell Value"
                                size="small"
                                disabled={disableForm}
                              />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <FormTextField
                                name="capitalGainTax"
                                type="number"
                                placeholder="Capital Gain Tax"
                                label="Capital Gain Tax"
                                size="small"
                                disabled={disableForm}
                              />
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ py: 1 }} variant="fullWidth" />
                    </Grid>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          px: 2,
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Typography variant="h6">To</Typography>
                        <ToShareholdersFormField
                          size="small"
                          name="toShareholders"
                          exclude={
                            (values.fromShareholder?.id && [
                              values.fromShareholder.id,
                            ]) ||
                            undefined
                          }
                          value={transferInfo?.toShareholders}
                          disabled={disableForm}
                        />
                        {!!values.toShareholders?.length && (
                          <TableContainer sx={{ p: 2 }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Shareholder Id</TableCell>
                                  <TableCell>Shareholder Name</TableCell>
                                  <TableCell>Transfer Amount (ETB)</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {values.toShareholders.map(
                                  (shareholder, index) => (
                                    <TableRow
                                      key={shareholder.id}
                                      sx={{
                                        "&:last-child td, &:last-child th": {
                                          border: 0,
                                        },
                                      }}
                                    >
                                      <TableCell component="th" scope="row">
                                        {shareholder.id}
                                      </TableCell>
                                      <TableCell component="th" scope="row">
                                        {shareholder.displayName}
                                      </TableCell>
                                      <TableCell>
                                        <FormTextField
                                          name={`toShareholders[${index}]transferredAmount`}
                                          type="number"
                                          size="small"
                                          disabled={disableForm}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                                {values.toShareholders.length > 1 && (
                                  <TableRow>
                                    <TableCell />
                                    <TableCell align="right">
                                      <Typography variant="subtitle2">
                                        Total{" "}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="subtitle1">
                                        {" "}
                                        {formatNumber(
                                          totalTransferred(values)
                                        )}{" "}
                                        ETB{" "}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ py: 1 }} variant="fullWidth" />
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2">
                            Transfer Location
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <FormSelectField
                            name="districtId"
                            type="number"
                            placeholder="District"
                            label="District"
                            options={districtLookups}
                            size="small"
                            disabled={disableForm}
                          />{" "}
                        </Grid>
                        <Grid item xs={6}>
                          <FormSelectField
                            name="branchId"
                            type="number"
                            placeholder="Branch"
                            label="Branch"
                            options={branchLookups}
                            size="small"
                            disabled={disableForm}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ py: 1 }} variant="fullWidth" />
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
                        disabled={disableForm}
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
                    disabled={disableForm}
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
