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
import { useCallback, useMemo } from "react";
import * as yup from "yup";
import {
  SubscriptionPaymentDto,
  TransferDto,
  useSavePaymentTransfersMutation,
} from "../../app/api";
import { DialogHeader, Errors, FormTextField } from "../../components";
import { usePermission } from "../../hooks";
import { YupShape } from "../../utils";
import { formatNumber } from "../common";
import { useCurrentVersion } from "../shareholder/useCurrentVersion";

interface Transferred {
  amount: number;
  shareholderId: number;
  shareholderName: string;
  totalToTransfer: number;
  totalTransferred: number;
}

const validationSchema = yup.object<YupShape<Transferred[]>>({});
export const TransferPaymentDialog = ({
  onClose,
  transfer,
  payment,
}: {
  transfer?: TransferDto;
  onClose: () => void;
  payment?: SubscriptionPaymentDto;
}) => {
  const [savePaymentTransfers, { error: savePaymentTransfersError }] =
    useSavePaymentTransfersMutation();

  const { loadCurrentVersion } = useCurrentVersion();
  const permissions = usePermission();

  const paymentTransfers = useMemo(() => {
    const payments = (transfer?.transferees || []).map<Transferred>((t) => {
      return {
        shareholderId: t.shareholderId!,
        amount:
          t.payments?.find((p) => p.paymentId == payment?.id)?.amount || 0,
        totalToTransfer: t.amount || 0,
        totalTransferred: t.transferredAmount || 0,
        shareholderName: t.shareholder?.displayName || "",
      };
    });

    return payments;
  }, [payment, transfer]);

  const handleSubmit = useCallback(
    (value: Transferred[]) => {
      savePaymentTransfers({
        savePaymentTransfersCommand: {
          paymentId: payment?.id,
          transferId: transfer?.id,
          payments: value.map(({ shareholderId, amount }) => ({
            shareholderId,
            amount,
          })),
        },
      })
        .unwrap()
        .then(() => {
          onClose();
          loadCurrentVersion();
        })
        .catch(() => {});
    },
    [
      loadCurrentVersion,
      onClose,
      payment?.id,
      savePaymentTransfers,
      transfer?.id,
    ]
  );

  const totalTransferred = (data?: Transferred[]) =>
    (data || []).reduce((v, p) => v + p.amount, 0);

  const errors = (savePaymentTransfersError as any)?.data?.errors;
  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      fullWidth
      maxWidth={"lg"}
      open={true}
    >
      {!!paymentTransfers?.length && (
        <Formik
          initialValues={paymentTransfers}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          validateOnChange={true}
        >
          {({ values }) => {
            const availableForTransfer =
              (payment?.amount || 0) -
              (values || []).reduce((v, c) => (v += +(c.amount || 0)), 0);

            const hasError = (t: Transferred) => {
              return t.totalToTransfer < t.amount;
            };

            const disableSaveButton =
              !permissions.canCreateOrUpdateTransfer ||
              availableForTransfer < 0 ||
              values.some(hasError);

            return (
              <Form>
                <DialogHeader title={"Transfer Payment"} onClose={onClose} />
                <DialogContent dividers={true}>
                  <Grid container spacing={2}>
                    {errors && (
                      <Grid item xs={12}>
                        <Errors errors={errors as any} />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              alignItems: "center",
                            }}
                          >
                            <Typography>Payment Amount</Typography>
                            <Typography
                              variant="subtitle2"
                              color={"success.main"}
                            >
                              {payment?.amount} ETB
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              alignItems: "center",
                            }}
                          >
                            <Typography>Available for Transfer</Typography>
                            <Typography
                              variant="subtitle2"
                              color={
                                availableForTransfer >= 0 ? "primary" : "error"
                              }
                            >
                              {availableForTransfer} ETB
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1, display: "flex", gap: 2 }}>
                          <Typography>Transfer</Typography>
                          <Box>
                            <Typography>
                              From:{" "}
                              <Typography
                                component={"span"}
                                variant="subtitle2"
                              >
                                {transfer?.fromShareholder?.displayName}
                              </Typography>{" "}
                            </Typography>
                            <Typography>
                              Effective Date:{" "}
                              <Typography
                                component={"span"}
                                variant="subtitle2"
                              >
                                {" "}
                                {transfer?.effectiveDate &&
                                  dayjs(transfer.effectiveDate).format(
                                    "MMMM D, YYYY"
                                  )}
                              </Typography>
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ pt: 2 }} />
                    </Grid>
                    {
                      <Grid item xs={12}>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Shareholder Id</TableCell>
                                <TableCell>Shareholder Name</TableCell>
                                <TableCell>
                                  Total To Transfer/Total Transferred
                                </TableCell>

                                <TableCell>Transfer Amount (ETB)</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {paymentTransfers.map((transferee, index) => (
                                <TableRow
                                  key={transferee.shareholderId}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                    backgroundColor: hasError(values[index])
                                      ? "#f8d6d6"
                                      : undefined,
                                  }}
                                >
                                  <TableCell component="th" scope="row">
                                    {transferee.shareholderId}
                                  </TableCell>
                                  <TableCell component="th" scope="row">
                                    {transferee.shareholderName}
                                  </TableCell>
                                  <TableCell>
                                    {formatNumber(transferee.totalToTransfer)}/
                                    {formatNumber(transferee.totalTransferred)}
                                  </TableCell>
                                  <TableCell>
                                    <FormTextField
                                      name={`[${index}].amount`}
                                      type="number"
                                      size="small"
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                              {
                                <TableRow>
                                  <TableCell sx={{ borderBottomWidth: 0 }} />
                                  <TableCell sx={{ borderBottomWidth: 0 }} />
                                  <TableCell
                                    align="right"
                                    sx={{ borderBottomWidth: 0 }}
                                  >
                                    <Typography variant="subtitle2">
                                      Total
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ borderBottomWidth: 0 }}>
                                    <Typography variant="subtitle2">
                                      {`${formatNumber(
                                        totalTransferred(values)
                                      )} `}
                                      ETB
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              }
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    }
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button
                    color="primary"
                    variant="outlined"
                    type="submit"
                    disabled={disableSaveButton}
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
