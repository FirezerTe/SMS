import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
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
import CloseIcon from "@mui/icons-material/Close";
import {
  EndOfDayDto,
  RigsTransaction,
  useExportToCsvFileMutation,
  useGetDailyTransactionsQuery,
} from "../../app/api";
import dayjs from "dayjs";
import React from "react";
import { Errors } from "../../components";

export const EndOfDayTransactionDetail = ({
  transactionDate,
  description,
  open,
  onClose,
}: {
  transactionDate: EndOfDayDto;
  description: EndOfDayDto;
  onClose: () => void;
  open: boolean;
}) => {
  const paymentDate = transactionDate.date;
  const currentdate = dayjs(paymentDate).format("YYYY-MM-DD");
  const [page, setPage] = useState(0);
  const [showPage, setShowPage] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ExportCSVFile] = useExportToCsvFileMutation() as any;

  const ExportExcelFile = async (data: EndOfDayDto[]) => {
    let csvContent =
      "SubscriptionId,Amount,Reference,BranchName,AccountNumber\n"; // Add column headers
    data.forEach(async (item) => {
      csvContent += `${item.subscriptionId},${item.amount},${item.transactionReference},${item.branchName},${item.branchShareGl}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "data.csv";
    await downloadLink.click();
  };
  const ExportCBSExcelFile = async (data: RigsTransaction[]) => {
    let csvContent = "EventCode,Amount,Reference,BranchName,AccountNumber\n"; // Add column headers
    data.forEach(async (item) => {
      csvContent += `${item.eventCodeField},${item.transactionAmountField},${item.transactionReferenceTextField},${item.businessUnitField},${item.accountNumberField}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "data.csv";
    await downloadLink.click();
  };
  const { data: SMSList, error } = useGetDailyTransactionsQuery({
    transactionDate: transactionDate as any,
    pageSize: rowsPerPage,
    pageNumber: page + 1,
  });

  const { data: PremiumInfo } = useGetDailyTransactionsQuery({
    transactionDate: transactionDate as any,
    pageSize: rowsPerPage,
    pageNumber: page + 1,
  });

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
  const totalCoreItem = SMSList?.totalCoreItems as any;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const totalCorePages = Math.ceil(totalCoreItem / rowsPerPage);
  const [refresh, setRefresh] = useState(false);

  const GenerateSMSExcel = useCallback(
    async (csv: EndOfDayDto) => {
      const csvData: any[] = [...(SMSList?.endOfDayDtoList as EndOfDayDto[])];
      ExportExcelFile(await csvData);
      csv;
    },

    [ExportCSVFile, description, ExportExcelFile]
  );
  const GenerateCBSExcel = useCallback(
    async (csv: EndOfDayDto) => {
      const csvData: any[] = [...(SMSList?.rigsTransactions as EndOfDayDto[])];
      ExportCBSExcelFile(await csvData);
      csv;
    },

    [ExportCSVFile, ExportCBSExcelFile]
  );

  useEffect(() => {
    if (refresh) {
      setRefresh(false); // Reset refresh state after re-render
    }
  }, [refresh]);

  const apierror = (error as any)?.data?.detail;

  if (!open) {
    return null;
  }

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={open}
    >
      <Box>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          SMS and Core Detail Transaction on Date {transactionDate as any}
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
        <DialogContent dividers={true} sx={{ width: 1000 }}>
          {!refresh ? (
            <Grid container justifyContent="flex">
              <Grid>
                {apierror && (
                  <Grid item xs={12}>
                    <Errors errors={{ apierror }} />
                  </Grid>
                )}

                <Paper sx={{ width: "850px" }}>
                  {currentdate && (
                    <TableContainer>
                      Share Management Transaction
                      <Button
                        color="primary"
                        variant="outlined"
                        type="submit"
                        sx={{ m: 1 }}
                        onClick={() => GenerateSMSExcel(SMSList as any)}
                      >
                        Excel_SMS
                      </Button>
                      <Table
                        sx={{ width: "850px" }}
                        size="small"
                        aria-label="a dense table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ width: "100px" }}>Id</TableCell>
                            <TableCell sx={{ width: "60px" }}>Amount</TableCell>
                            <TableCell sx={{ width: "130px" }}>
                              Transaction Reference
                            </TableCell>
                            <TableCell sx={{ width: "100px" }}>
                              Branch Name
                            </TableCell>
                            <TableCell sx={{ width: "140px" }}>
                              Branch Share GL
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          <FormHelperText>Payment Collected</FormHelperText>
                          {(SMSList?.endOfDayDtoList || []).map(
                            ({
                              branchName,
                              branchShareGl,
                              id,
                              subscriptionId,
                              amount,
                              transactionReference,
                            }) => (
                              <TableRow hover key={id}>
                                <TableCell>{subscriptionId}</TableCell>
                                <TableCell>{amount}</TableCell>
                                <TableCell>{transactionReference}</TableCell>
                                <TableCell>{branchName}</TableCell>
                                <TableCell>{branchShareGl}</TableCell>
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
                </Paper>
                <Paper sx={{ width: "850px" }}>
                  {currentdate && (
                    <TableContainer>
                      Core Banking Transaction Lists
                      <Button
                        color="primary"
                        variant="outlined"
                        type="submit"
                        sx={{ m: 1 }}
                        onClick={() => GenerateCBSExcel(SMSList as any)}
                      >
                        Excel_CBS
                      </Button>
                      <Table
                        sx={{ width: "850px" }}
                        size="small"
                        aria-label="a dense table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ width: "100px" }}>
                              Transactin ID
                            </TableCell>
                            <TableCell sx={{ width: "60px" }}>Amount</TableCell>
                            <TableCell sx={{ width: "130px" }}>
                              Transaction Reference
                            </TableCell>
                            <TableCell sx={{ width: "100px" }}>
                              Branch Name
                            </TableCell>
                            <TableCell sx={{ width: "140px" }}>
                              Account Number
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          <FormHelperText>CBS Payment Collected</FormHelperText>
                          {(SMSList?.rigsTransactions || []).map(
                            ({
                              id,
                              transactionAmountField,
                              transactionIdField,
                              businessUnitField,
                              eventCodeField,
                              accountNumberField,
                            }) => (
                              <TableRow hover key={id}>
                                <TableCell>{eventCodeField}</TableCell>
                                <TableCell>{transactionAmountField}</TableCell>
                                <TableCell>{transactionIdField}</TableCell>
                                <TableCell>{businessUnitField}</TableCell>
                                <TableCell>{accountNumberField}</TableCell>
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
                      count={totalCoreItem}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      nextIconButtonProps={{
                        disabled: page >= totalCorePages - 1,
                      }}
                      backIconButtonProps={{ disabled: page === 0 }}
                    />
                  )}

                  <Box>
                    <Grid container justifyContent="flex-end" paddingTop={2}>
                      <Grid
                        xs={12}
                        container
                        justifyContent="flex-end"
                        paddingRight={3}
                      >
                        <FormLabel>
                          Total transaction amount from SMS |{" "}
                          {(SMSList?.totalAmount ?? 0) +
                            (PremiumInfo?.totalPremiumAmount ?? 0)}
                        </FormLabel>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        container
                        justifyContent="flex-end"
                        paddingRight={3}
                      >
                        <FormLabel>
                          Total transaction amount from CBS |{" "}
                          {SMSList?.totalRubiTransactionAmount}{" "}
                        </FormLabel>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        container
                        justifyContent="flex-end"
                        paddingRight={3}
                        paddingBottom={2}
                      >
                        <FormLabel>
                          Difference Amount form CBS and SMS |{" "}
                          {(SMSList?.totalRubiTransactionAmount ?? 0) -
                            ((SMSList?.totalAmount ?? 0) +
                              (PremiumInfo?.totalPremiumAmount ?? 0))}
                        </FormLabel>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          ) : null}
        </DialogContent>
      </Box>
    </Dialog>
  );
};
