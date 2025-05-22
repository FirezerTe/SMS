import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { flatten } from "lodash-es";
import { Fragment, useCallback, useMemo, useState } from "react";
import {
  SubscriptionPaymentDto,
  TransferDto,
  useUploadSubscriptionPaymentReceiptMutation,
} from "../../app/api";
import {
  ApprovalStatus,
  PaymentType,
  ShareholderChangeLogEntityType,
} from "../../app/api/enums";
import { DocumentUpload } from "../../components";
import { usePermission } from "../../hooks";
import {
  PaymentMethodLabel,
  PaymentTypeLabel,
  getChangelogStyle,
  isAdjustmentPaymentType,
} from "../../utils";
import { useBranches } from "../Branch";
import { useDistricts } from "../District";
import { formatNumber } from "../common";
import { useAlert } from "../notification";
import { useShareholderIdAndVersion } from "../shareholder";
import { useShareholderChangeLogs } from "../shareholder/shareholderDetail/shareholderChangeLog";
import { NewPaymentAdjustmentDialog } from "./NewPaymentAdjustmentDialog";
import { PaymentWarningIcon } from "./PaymentWarningIcon";
import { SubscriptionPaymentDetailDialog } from "./SubscriptionPaymentDetailDialog";
import { SubscriptionPaymentDialog } from "./SubscriptionPaymentDialog";
import { TransferPaymentDialog } from "./TransferPaymentDialog";

export type PaymentAction =
  | "edit"
  | "viewDetail"
  | "pay"
  | "transfer"
  | "adjustment";

export const SubscriptionPaymentsList = ({
  payments = [],
  transfer,
}: {
  payments?: SubscriptionPaymentDto[];
  transfer?: TransferDto;
}) => {
  const [selectedPayment, setSelectedPayment] = useState<{
    action: PaymentAction;
    payment: SubscriptionPaymentDto;
  }>();

  const { id } = useShareholderIdAndVersion();

  const { districts } = useDistricts();
  const { branches } = useBranches();
  const { showSuccessAlert, showErrorAlert } = useAlert();
  const [uploadReceipt] = useUploadSubscriptionPaymentReceiptMutation();
  const permissions = usePermission();

  const { changeLogs } = useShareholderChangeLogs();

  const getChangeLog = useCallback(
    (address: SubscriptionPaymentDto) =>
      changeLogs?.find(
        (c) =>
          c.entityType === ShareholderChangeLogEntityType.Payment &&
          c.entityId === address.id
      ),
    [changeLogs]
  );

  const mappedPayments = useMemo(
    () =>
      (payments || []).map((payment) => ({
        ...payment,
        district:
          districts?.find((d) => d.id === payment.districtId)?.districtName ||
          "-",
        branch:
          branches?.find((b) => b.id === payment.branchId)?.branchName || "-",
        paymentDate:
          (payment.effectiveDate &&
            dayjs(payment.effectiveDate).format("MMMM D, YYYY")) ||
          "",
        endDate:
          (payment.endDate && dayjs(payment.endDate).format("MMMM D, YYYY")) ||
          "",
        hasTransfer: !!transfer?.transferees?.some((t) =>
          t.payments?.some((p) => p.paymentId === payment.id)
        ),
        canNotBeAdjusted:
          payment.paymentTypeEnum === PaymentType.TransferPayment ||
          isAdjustmentPaymentType(payment.paymentTypeEnum) ||
          payments.some(
            (p) =>
              p.parentPaymentId === payment.id &&
              p.approvalStatus === ApprovalStatus.Approved &&
              isAdjustmentPaymentType(p.paymentTypeEnum)
          ),
      })),
    [branches, districts, payments, transfer?.transferees]
  );

  const uploadPaymentRecept = (paymentId: number) => async (files: any[]) => {
    if (files?.length) {
      uploadReceipt({
        id: paymentId,
        body: {
          file: files[0],
        },
      })
        .unwrap()
        .then(() => {
          showSuccessAlert("Receipt uploaded");
        })
        .catch(() => {
          showErrorAlert("Error occurred");
        });
    }
  };

  if (!mappedPayments?.length) return null;

  const showTransferButton = (payment: SubscriptionPaymentDto) =>
    (payment.amount || 0) > 0 &&
    payment.approvalStatus === ApprovalStatus.Approved &&
    transfer &&
    transfer.fromShareholderId === id &&
    (!payment.endDate ||
      dayjs(payment.endDate).isAfter(transfer.effectiveDate));

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Amount (ETB)</TableCell>
            <TableCell>Payment Date</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Payment Type</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Payment Location (District/Branch)</TableCell>
            <TableCell>Reference #</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mappedPayments.map((payment) => (
            <Fragment key={payment.id}>
              <TableRow
                hover={true}
                key={payment.id}
                sx={{
                  backgroundColor:
                    payment.parentPaymentId || payment.hasChildPayment
                      ? toColor(payment.parentPaymentId || payment.id)
                      : undefined,

                  "&.MuiTableRow-root:hover": {
                    backgroundColor:
                      payment.parentPaymentId || payment.hasChildPayment
                        ? toColor(payment.parentPaymentId || payment.id, 0.3)
                        : undefined,
                  },
                  filter:
                    payment?.endDate ||
                    payment.parentPaymentId ||
                    payment.unapprovedAdjustments?.length ||
                    payment.unapprovedTransfers?.length
                      ? "brightness(1)"
                      : undefined,
                  ...getChangelogStyle(getChangeLog(payment)),
                }}
              >
                <TableCell
                  sx={{
                    width: 150,
                    borderBottomWidth:
                      payment.hasTransfer || payment.note ? 0 : undefined,
                  }}
                >
                  {formatNumber(payment.amount)}
                </TableCell>
                <TableCell
                  sx={{
                    width: 150,
                    borderBottomWidth:
                      payment.hasTransfer || payment.note ? 0 : undefined,
                  }}
                >
                  {payment.paymentDate}
                </TableCell>
                <TableCell
                  sx={{
                    width: 150,
                    borderBottomWidth:
                      payment.hasTransfer || payment.note ? 0 : undefined,
                  }}
                >
                  {payment.paymentMethodEnum &&
                    PaymentMethodLabel[payment.paymentMethodEnum]}
                </TableCell>
                <TableCell
                  sx={{
                    width: 150,
                    borderBottomWidth:
                      payment.hasTransfer || payment.note ? 0 : undefined,
                  }}
                >
                  {payment.paymentTypeEnum &&
                    PaymentTypeLabel[payment.paymentTypeEnum]}
                </TableCell>
                <TableCell
                  sx={{
                    width: 150,
                    borderBottomWidth:
                      payment.hasTransfer || payment.note ? 0 : undefined,
                  }}
                >
                  {payment.endDate}
                </TableCell>
                <TableCell
                  sx={{
                    width: 250,
                    borderBottomWidth:
                      payment.hasTransfer || payment.note ? 0 : undefined,
                  }}
                >{`${payment.district}/${payment.branch}`}</TableCell>
                <TableCell
                  sx={{
                    width: 100,
                    borderBottomWidth:
                      payment.hasTransfer || payment.note ? 0 : undefined,
                  }}
                >
                  {payment.originalReferenceNo}
                </TableCell>

                <TableCell
                  sx={{
                    py: 0,
                    width: 300,
                    borderBottomWidth:
                      payment.hasTransfer || payment.note ? 0 : undefined,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    {!payment.isReadOnly && (
                      <>
                        {permissions.canCreateOrUpdatePayment &&
                          payment.approvalStatus !== ApprovalStatus.Approved &&
                          payment?.id && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <DocumentUpload
                                onAdd={uploadPaymentRecept(payment.id)}
                                label={"Recept"}
                                showIcon={true}
                                size="small"
                              />
                            </Box>
                          )}

                        {permissions.canCreateOrUpdatePayment &&
                          payment.approvalStatus !==
                            ApprovalStatus.Approved && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Button
                                size="small"
                                onClick={() => {
                                  setSelectedPayment({
                                    payment,
                                    action: "edit",
                                  });
                                }}
                                startIcon={<EditIcon />}
                              >
                                Edit
                              </Button>
                            </Box>
                          )}
                        {permissions.canCreateOrUpdatePayment &&
                          payment.approvalStatus === ApprovalStatus.Approved &&
                          !payment.canNotBeAdjusted &&
                          !payment.endDate && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Button
                                size="small"
                                disabled={
                                  !!payment.unapprovedAdjustments?.length
                                }
                                onClick={() => {
                                  setSelectedPayment({
                                    payment,
                                    action: "adjustment",
                                  });
                                }}
                                startIcon={<AddIcon />}
                              >
                                Adjustment
                              </Button>
                            </Box>
                          )}
                      </>
                    )}
                    {permissions.canCreateOrUpdateTransfer &&
                      showTransferButton(payment) && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedPayment({
                                payment,
                                action: "transfer",
                              });
                            }}
                            startIcon={<AddIcon />}
                          >
                            Transfer
                          </Button>
                        </Box>
                      )}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Button
                        size="small"
                        onClick={() =>
                          setSelectedPayment({ payment, action: "viewDetail" })
                        }
                        startIcon={<VisibilityIcon />}
                      >
                        Detail
                      </Button>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PaymentWarningIcon payment={payment} />
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
              {payment.note && (
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={9}
                    sx={{
                      backgroundColor:
                        payment.parentPaymentId || payment.hasChildPayment
                          ? toColor(payment.parentPaymentId || payment.id)
                          : undefined,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        py: 0.5,
                      }}
                    >
                      <Typography variant="caption">Note: </Typography>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ py: 1, fontStyle: "italic" }}
                        >
                          {payment.note}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {payment.hasTransfer && (
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={9}
                    sx={{
                      backgroundColor:
                        payment.parentPaymentId || payment.hasChildPayment
                          ? toColor(payment.parentPaymentId || payment.id)
                          : undefined,
                    }}
                  >
                    <PaymentTransferDto transfer={transfer} payment={payment} />
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
      {selectedPayment?.action === "viewDetail" && selectedPayment?.payment && (
        <SubscriptionPaymentDetailDialog
          onClose={() => setSelectedPayment(undefined)}
          subscriptionId={selectedPayment.payment.subscriptionId!}
          payment={selectedPayment.payment}
        />
      )}
      {selectedPayment?.action === "edit" &&
        selectedPayment?.payment &&
        (selectedPayment.payment.paymentTypeEnum == PaymentType.Correction ||
        selectedPayment.payment.paymentTypeEnum === PaymentType.Reversal ? (
          <NewPaymentAdjustmentDialog
            onClose={() => setSelectedPayment(undefined)}
            payment={selectedPayment.payment}
            parentPayment={selectedPayment.payment.parentPayment!}
          />
        ) : (
          <SubscriptionPaymentDialog
            onClose={() => setSelectedPayment(undefined)}
            subscriptionId={selectedPayment.payment.subscriptionId!}
            payment={selectedPayment.payment}
          />
        ))}
      {selectedPayment?.action === "transfer" && selectedPayment?.payment && (
        <TransferPaymentDialog
          onClose={() => setSelectedPayment(undefined)}
          payment={selectedPayment.payment}
          transfer={transfer}
        />
      )}
      {selectedPayment?.action === "adjustment" && selectedPayment?.payment && (
        <NewPaymentAdjustmentDialog
          onClose={() => setSelectedPayment(undefined)}
          parentPayment={selectedPayment.payment}
        />
      )}
    </>
  );
};

const PaymentTransferDto = ({
  transfer,
  payment,
}: {
  transfer?: TransferDto;
  payment?: SubscriptionPaymentDto;
}) => {
  const { transferPerShareholder, availableForTransfer } = useMemo(() => {
    const totalTransferred = flatten(
      (transfer?.transferees || [])
        .map((t) => t.payments?.filter((p) => p.paymentId === payment?.id))
        .filter((x) => x)
    ).reduce((v, c) => (v += c?.amount || 0), 0);

    const transferPerShareholder = (transfer?.transferees || []).reduce(
      (v, c) => {
        const transferred = c.payments
          ?.filter((p) => p.paymentId == payment?.id)
          ?.reduce((v, p) => (v += +(p.amount || 0)), 0);
        return [
          ...v,
          {
            shareholderName: c.shareholder?.displayName || "",
            amount: transferred || 0,
          },
        ];
      },
      [] as Array<{ shareholderName: string; amount: number }>
    );

    const availableForTransfer = (payment?.amount || 0) - totalTransferred;

    return { transferPerShareholder, availableForTransfer };
  }, [payment, transfer]);

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Box>
        <Typography variant="body1" color="textSecondary">
          Transfers
        </Typography>
        <Box
          sx={{ display: "flex", gap: 2, mt: 1, alignItems: "center", px: 2 }}
        >
          <Typography variant="subtitle2" color="textSecondary">
            Available for transfer
          </Typography>
          <Typography
            variant="subtitle2"
            color={availableForTransfer < 0 ? "error" : "primary"}
          >
            {availableForTransfer} ETB
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2 }}>
        <Typography variant="subtitle2" color="textSecondary" sx={{ pt: 1 }}>
          Transferred to
        </Typography>
        <Box sx={{ px: 2 }}>
          {transferPerShareholder.map((t) => (
            <Box key={t.shareholderName} sx={{ display: "flex", gap: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                {t.shareholderName}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                {t.amount} ETB
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const toColor = (id?: number, opacity?: number) => {
  if (!id) return;

  const _id = id * 123456789;
  const b = _id & 0xff;
  const g = (_id & 0xff00) >>> 8;
  const r = (_id & 0xff0000) >>> 16;

  const result = "rgba(" + [r, g, b, opacity || 0.15].join(",") + ")";

  return result;
};
