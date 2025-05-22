import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DividendDto,
  DividendSetupDto,
  useApproveDividendSetupMutation,
  useGetSetupDividendsQuery,
  useGetShareholderDividendDetailQuery,
} from "../../app/api";
import { ApprovalStatus } from "../../app/api/enums";
import { Pagination } from "../../components";
import { usePermission } from "../../hooks";
import { formatNumber } from "../common";
import { useAlert } from "../notification";
import { useDividendPeriods } from "./useDividendPeriods";

interface Props {
  setup: DividendSetupDto;
  open: boolean;
  onClose: () => void;
}

export const DividendSetupDetailDialog = ({ setup, onClose }: Props) => {
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize: number;
  }>({
    pageNumber: 0,
    pageSize: 25,
  });

  const { data } = useGetSetupDividendsQuery(
    {
      setupId: setup.id!,
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    },
    {
      skip: !setup.id,
    }
  );

  const { getDividendPeriod } = useDividendPeriods();
  const [approveDividendSetup] = useApproveDividendSetupMutation();
  const { canApproveDividendSetup } = usePermission();

  const { showSuccessAlert, showErrorAlert } = useAlert();

  const approveSetup = useCallback(() => {
    approveDividendSetup({
      approveDividendSetupCommand: {
        setupID: setup.id,
      },
    })
      .unwrap()
      .then(() => {
        showSuccessAlert("Approved");
      })
      .catch(() => {
        showErrorAlert("Error Occurred");
      });
  }, [approveDividendSetup, setup.id, showErrorAlert, showSuccessAlert]);

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      fullScreen
      open={true}
      sx={{ p: 2 }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Shareholder Dividends
        <Typography>
          {getDividendPeriod(setup.dividendPeriodId)?.year || ""}
        </Typography>
        <Typography variant="body2">
          Declared Amount:{" "}
          <Typography component={"span"} sx={{ ml: 1 }} variant="subtitle2">
            {" "}
            {formatNumber(setup.declaredAmount, 2)} ETB
          </Typography>
        </Typography>
        <Typography variant="body2">
          Allocation Added{" "}
          <Typography component={"span"} sx={{ ml: 1 }} variant="subtitle2">
            {" "}
            {formatNumber(setup.additionalAllocationAmount, 2)} ETB
          </Typography>
        </Typography>
        {setup.approvalStatus !== ApprovalStatus.Approved && (
          <Box sx={{ position: "absolute", top: 20, left: "50%" }}>
            <Button
              onClick={approveSetup}
              variant="contained"
              size="large"
              sx={{ px: 6 }}
              disabled={!canApproveDividendSetup}
            >
              Approve
            </Button>
          </Box>
        )}
        <IconButton
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableCell></TableCell>
              <TableCell>Shareholder</TableCell>
              <TableCell align="right">
                Subscription Payment
                {!!data && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", fontSize: "0.8rem !important" }}
                  >
                    Total {formatNumber(data.totalSubscriptionPayments, 2)}
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">
                Subscription Payment (Weighted Avg.)
                {!!data && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", fontSize: "0.8rem !important" }}
                  >
                    Total{" "}
                    {formatNumber(data.totalWeightedSubscriptionPayments, 2)}
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">
                Dividend
                {!!data && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", fontSize: "0.8rem !important" }}
                  >
                    Total {formatNumber(data.totalDividends, 2)}
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right">
                Capitalization Limit
                {data && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", fontSize: "0.8rem !important" }}
                  >
                    Total {formatNumber(data.totalCapitalizationLimit, 2)}
                  </Typography>
                )}
              </TableCell>
            </TableHead>
            <TableBody>
              {(data?.dividends || []).map((dividend) => (
                <ShareholderDividendRow
                  key={dividend.shareholderId}
                  dividend={dividend}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {(!!data?.totalDividendsCount && (
          <Pagination
            pageNumber={pagination.pageNumber}
            pageSize={pagination.pageSize}
            onChange={setPagination}
            totalRowsCount={data?.totalDividendsCount}
            rowsPerPageOptions={[25, 50, 100]}
          />
        )) || (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Typography variant="body1">No Data Available</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const ShareholderDividendRow = ({
  dividend: {
    dividendAmount,
    shareholderDisplayName,
    totalPaidAmount,
    totalPaidWeightedAverage,
    dividendSetupId,
    shareholderId,
    capitalizeLimit,
  },
}: {
  dividend: DividendDto;
}) => {
  const [showDividendPaymentDetail, setShowDividendPaymentDetail] =
    useState(false);

  const navigate = useNavigate();

  return (
    <>
      <TableRow
        sx={{
          "& > *": {
            borderBottom: !showDividendPaymentDetail
              ? undefined
              : "0 !important",
          },
        }}
      >
        <TableCell>
          <Button
            onClick={() =>
              setShowDividendPaymentDetail(!showDividendPaymentDetail)
            }
            startIcon={
              showDividendPaymentDetail ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )
            }
            sx={{ m: -1 }}
          >
            {`${!showDividendPaymentDetail ? "View" : "Hide"} Payments`}
          </Button>
        </TableCell>
        <TableCell>
          <Link
            variant="button"
            onClick={() => {
              navigate(`/shareholder-detail/${shareholderId}/dividends`);
            }}
            underline="none"
            sx={{ cursor: "pointer" }}
          >
            {shareholderDisplayName}
          </Link>
        </TableCell>
        <TableCell align="right">{formatNumber(totalPaidAmount, 4)}</TableCell>
        <TableCell align="right" sx={{ fontWeight: "bold" }}>
          {formatNumber(totalPaidWeightedAverage, 4)}
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: "bold" }}>
          {formatNumber(dividendAmount, 4)}
        </TableCell>
        <TableCell align="right" sx={{ fontWeight: "bold" }}>
          {formatNumber(capitalizeLimit, 4)}
        </TableCell>
      </TableRow>
      {showDividendPaymentDetail && (
        <TableRow>
          <TableCell colSpan={6}>
            <ShareholderDividendSetupPaymentsList
              shareholderId={shareholderId}
              setupId={dividendSetupId}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const ShareholderDividendSetupPaymentsList = ({
  shareholderId,
  setupId,
}: {
  shareholderId?: number;
  setupId?: number;
}) => {
  const { data } = useGetShareholderDividendDetailQuery(
    {
      setupId: setupId!,
      shareholderId: shareholderId!,
    },
    {
      skip: !setupId || !shareholderId,
    }
  );
  return (
    <Box sx={{ mx: 8, my: 2, backgroundColor: "#fafafb", py: 1 }}>
      <TableContainer>
        <Table size={"small"}>
          <TableHead>
            <TableCell>Payment Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Working Days</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Weighted Average</TableCell>
          </TableHead>
          <TableBody>
            {!!data?.payments?.length && (
              <>
                {data.payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      {p.effectiveDate &&
                        dayjs(p.effectiveDate).format("MMMM D, YYYY")}
                    </TableCell>
                    <TableCell>
                      {p.endDate && dayjs(p.endDate).format("MMMM D, YYYY")}
                    </TableCell>
                    <TableCell>{p.workingDays}</TableCell>

                    <TableCell align="right">
                      {formatNumber(p.amount, 4)}
                    </TableCell>
                    <TableCell align="right">
                      {formatNumber(p.weightedAverageAmt, 4)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow
                  sx={{
                    fontWeight: "bold",
                    "& > *": { borderBottom: "0 !important" },
                  }}
                >
                  <TableCell sx={{ py: 3 }} colSpan={3}></TableCell>

                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    <Typography
                      sx={{ mr: 4 }}
                      component={"span"}
                      variant="subtitle2"
                    >
                      Total
                    </Typography>
                    {formatNumber(data.totalPaymentAmount, 4)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    {formatNumber(data.totalWeightedAveragePaymentAmount, 4)}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
