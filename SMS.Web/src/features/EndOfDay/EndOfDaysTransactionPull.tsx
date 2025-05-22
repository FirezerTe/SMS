import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  FormHelperText,
  FormLabel,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  EndOfDayDto,
  ProcessEodDto,
  useExportToCsvFileMutation,
  useGetDailyTransactionsQuery,
  useProcessEodMutation,
} from "../../app/api";
import dayjs from "dayjs";
import React from "react";
import { Errors } from "../../components";
import { useAlert } from "../notification";
import { EndOfDayTransactionDetail } from "./EndOfDayTransactionDetail";

export const EndOfDayTransactionPull = ({
  transactionDate,
  description,
}: {
  transactionDate: EndOfDayDto;
  description: EndOfDayDto;
}) => {
  const paymentDate = transactionDate.date;
  const currentdate = dayjs(paymentDate).format("YYYY-MM-DD");
  const [page, setPage] = useState(0);
  const [showPage, setShowPage] = useState(false);
  const [showEodError, setShowEodError] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ProcessEODTxn, { error: ProcessEodError, isLoading }] =
    useProcessEodMutation();
  const [ExportCSVFile] = useExportToCsvFileMutation() as any;
  const { showSuccessAlert } = useAlert();
  const ExportCSVExcelFile = async (data: ProcessEodDto[]) => {
    let csvContent = "GL_Number,Amount,TransactionType,AccountType\n"; // Add column headers
    data.forEach(async (item) => {
      csvContent += `${item.branchShareGl},${item.amount},${item.transactionType},${item.accountType}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "data.csv";
    await downloadLink.click();
  };

  const { data: SMSList, error } = useGetDailyTransactionsQuery({
    transactionDate: currentdate,
    pageSize: rowsPerPage,
    pageNumber: page + 1,
  });

  const { data: PremiumInfo } = useGetDailyTransactionsQuery({
    transactionDate: currentdate,
    pageSize: rowsPerPage,
    pageNumber: page + 1,
  });

  const PaymentCollect: ProcessEodDto = {
    branchShareGl: SMSList?.paymentGL,
    amount: SMSList?.totalAmount as any,
    accountType: SMSList?.generalLedgerList?.[0].accountType,
    transactionType: SMSList?.generalLedgerList?.[0].transactionType,
  };

  const premiumCollect: ProcessEodDto = {
    branchShareGl: SMSList?.premiumGL,
    amount: SMSList?.totalPremiumAmount as any,
    accountType: SMSList?.generalLedgerList?.[0].accountType,
    transactionType: SMSList?.generalLedgerList?.[0].transactionType,
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    setShowPage(false), SMSList;
  }, [page, currentdate, showPage, SMSList, rowsPerPage]);

  const totalItems = SMSList?.totalItems as any;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const Diff =
    (SMSList?.totalRubiTransactionAmount ?? 0) -
    ((SMSList?.totalAmount ?? 0) + (PremiumInfo?.totalPremiumAmount ?? 0)); // As per the accounting principle to show how the CD DR transaction settle

  const GenerateCSV = useCallback(
    async (csv: EndOfDayDto) => {
      const csvData: any[] = [
        PaymentCollect,
        premiumCollect,
        ...(SMSList?.endOfDayDtoList as EndOfDayDto[]),
      ];
      ExportCSVFile({
        body: [csvData],
        csv,
      });
      ExportCSVExcelFile(await csvData);
    },

    [ExportCSVFile, ExportCSVExcelFile]
  );

  const handleEOD = useCallback(
    (value: EndOfDayDto[], collected: EndOfDayDto, premium: EndOfDayDto) => {
      setLoading(true);
      try {
        ProcessEODTxn({
          date: currentdate as any,
          body: [...value, collected, premium],
          description: description.description as any,
        })
          .unwrap()
          .then(() => {
            showSuccessAlert("EOD Posted please check report and confirm!");
            setRefresh(true);
          })
          .catch((error) => {
            setShowEodError(error?.data?.detail);
          });
      } finally {
        setLoading(false);
      }
    },
    [ProcessEODTxn, currentdate, SMSList, loading]
  );

  useEffect(() => {
    if (refresh) {
      setRefresh(false); // Reset refresh state after re-render
    }
  }, [refresh]);

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const errors = (ProcessEodError as any)?.data?.errors;
  const apierror = (error as any)?.data?.detail;
  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <CircularProgress color="primary" size={40} />
        <span style={{ marginLeft: 10 }}>
          End of Day Posting in Progress...
        </span>
      </div>
    );
  }
  return (
    <Box>
      {!refresh ? (
        <Grid container justifyContent="flex">
          <Grid>
            {errors && (
              <Grid item xs={12}>
                <Errors errors={errors as any} />
              </Grid>
            )}
            {showEodError && (
              <Grid item xs={12}>
                <Errors errors={{ showEodError } as any} />
              </Grid>
            )}
            {apierror && (
              <Grid item xs={12}>
                <Errors errors={{ apierror }} />
              </Grid>
            )}
            <Paper sx={{ width: "850px" }}>
              {currentdate && (
                <TableContainer>
                  Reconciliation List
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ m: 1 }}
                    onClick={() => setShowDialog(true)}
                  >
                    View Detail
                  </Button>
                  <Table
                    sx={{ width: "850px" }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: "100px" }}>
                          Transaction Reference
                        </TableCell>
                        <TableCell sx={{ width: "100px" }}>
                          Branch Name
                        </TableCell>
                        <TableCell sx={{ width: "100px" }}>
                          SMS Payment Amount
                        </TableCell>
                        <TableCell sx={{ width: "130px" }}>
                          SMS Premium Amount
                        </TableCell>
                        <TableCell sx={{ width: "100px" }}>
                          CBS Amount
                        </TableCell>
                        <TableCell sx={{ width: "140px" }}>
                          Difference
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <FormHelperText>Payment Collected</FormHelperText>
                      {(SMSList?.eodReconciliationDtos || []).map(
                        ({
                          id,
                          cbsAmount,
                          smsPaymentAmount,
                          smsPremiumAmount,
                          transactionReferenceNumber,
                          difference,
                          branchName,
                        }) => (
                          <TableRow hover key={id}>
                            <TableCell>{transactionReferenceNumber}</TableCell>
                            <TableCell>{branchName}</TableCell>
                            <TableCell>{smsPaymentAmount}</TableCell>
                            <TableCell>{smsPremiumAmount}</TableCell>
                            <TableCell>{cbsAmount}</TableCell>
                            <TableCell>{difference}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {SMSList && (
                <TablePagination
                  rowsPerPageOptions={[10, 20, 30]}
                  component="div"
                  count={totalItems}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  nextIconButtonProps={{ disabled: page >= totalPages - 1 }}
                  backIconButtonProps={{ disabled: page === 0 }}
                />
              )}

              {showDialog && (
                <EndOfDayTransactionDetail
                  open={true}
                  onClose={() => {
                    setShowDialog(false);
                  }}
                  transactionDate={currentdate as any}
                  description={description as any}
                />
              )}
            </Paper>
          </Grid>

          <Grid paddingLeft={3}>
            <Paper>
              {currentdate && (
                <TableContainer>
                  <Table
                    sx={{ minWidth: 400 }}
                    size="medium"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>GL Number</TableCell>
                        <TableCell>GL Description</TableCell>
                        <TableCell>DR/CR</TableCell>
                        <TableCell>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell> {SMSList?.paymentGL}</TableCell>
                        <TableCell>
                          {SMSList?.generalLedgerList?.[0].description}
                        </TableCell>
                        <TableCell>
                          {SMSList?.generalLedgerList?.[0].transactionType}
                        </TableCell>
                        <TableCell>{SMSList?.totalAmount}</TableCell>
                      </TableRow>
                    </TableBody>

                    <TableBody>
                      <TableRow>
                        <TableCell> {SMSList?.premiumGL}</TableCell>
                        <TableCell>
                          {SMSList?.generalLedgerList?.[1].description}
                        </TableCell>
                        <TableCell>
                          {SMSList?.generalLedgerList?.[1].transactionType}
                        </TableCell>
                        <TableCell>{PremiumInfo?.totalPremiumAmount}</TableCell>
                      </TableRow>
                    </TableBody>

                    <TableBody>
                      <TableRow>
                        <TableCell>{SMSList?.shareSaleGL}</TableCell>
                        <TableCell>
                          {SMSList?.generalLedgerList?.[3].description}
                        </TableCell>
                        <TableCell>
                          {SMSList?.generalLedgerList?.[3].transactionType}
                        </TableCell>
                        <TableCell>
                          {SMSList?.totalRubiTransactionAmount}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Grid container justifyContent="flex-end" paddingTop={2}>
                <Grid paddingRight={3} paddingBottom={2}>
                  <FormLabel>Balance | {Diff}</FormLabel>
                </Grid>
              </Grid>

              {SMSList && (
                <TablePagination
                  rowsPerPageOptions={[10, 20, 30]}
                  component="div"
                  count={totalItems}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  nextIconButtonProps={{ disabled: page >= totalPages - 1 }}
                  backIconButtonProps={{ disabled: page === 0 }}
                />
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}></Grid>
          {currentdate && (
            <>
              <DialogActions sx={{ p: 1 }}>
                <Button
                  color="primary"
                  variant="outlined"
                  type="submit"
                  sx={{ m: 1 }}
                  onClick={() => GenerateCSV(SMSList as any)}
                >
                  Generate CSV
                </Button>
              </DialogActions>
              <DialogActions sx={{ p: 1 }}>
                <Button
                  color="primary"
                  variant="outlined"
                  type="submit"
                  sx={{ m: 1 }}
                  onClick={() =>
                    handleEOD(
                      SMSList?.endOfDayDtoList as EndOfDayDto[],
                      PaymentCollect,
                      premiumCollect
                    )
                  }
                  disabled={!SMSList}
                >
                  Process EOD
                </Button>
              </DialogActions>
            </>
          )}
        </Grid>
      ) : null}
    </Box>
  );
};
