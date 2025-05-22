import {
  Box,
  Button,
  CircularProgress,
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
import { debounce } from "lodash-es";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as yup from "yup";
import {
  DividendComputationResult,
  DividendComputationResults,
  DividendDecisionDto,
  DividendDecisionSummaryDto,
  ParValueDto,
  SaveDividendDecisionCommand,
  useEvaluateDividendDecisionMutation,
  useSubmitDividendDecisionMutation,
} from "../../../app/api";
import { DividendDecisionType } from "../../../app/api/enums";
import {
  DialogHeader,
  Errors,
  FormSelectField,
  FormTextField,
} from "../../../components";
import { usePermission } from "../../../hooks";
import { YupShape, removeEmptyFields } from "../../../utils";
import { useBranches } from "../../Branch";
import { useDistricts } from "../../District";
import { useParValue } from "../../ParValue";
import { formatNumber } from "../../common";
import { useAlert } from "../../notification";
import { useDividendDecisionLookup } from "../useDividendDecisionLookup";
import { DividendPeriodTooltip } from "./DividendPeriodTooltip";

interface DividendActionFormData {
  capitalizedAmount: number;
  decisionDate: string;
  districtId: number;
  branchId: number;
  additionalSharesWillingToBuy: number;
  decision: DividendDecisionType;
}

const validationSchema = (parValue: ParValueDto) =>
  yup.object<YupShape<DividendActionFormData>>({
    branchId: yup.number().required("Branch is required"),
    districtId: yup.number().required("District is required"),
    decision: yup.number().required("Action is required"),
    decisionDate: yup.date().required("Decision date is required"),
    additionalSharesWillingToBuy: yup.number().optional(),
    capitalizedAmount: yup
      .number()
      .required("Amount to Capitalize is required")
      .test("", (value, { createError }) => {
        return !!parValue?.amount && value % parValue.amount
          ? createError({
              message: `Amount must be multiple of single share value (${parValue.amount} ETB)`,
              path: "capitalizedAmount",
            })
          : true;
      }),
  });

const emptyFormData = {
  decisionDate: dayjs(),
  districtId: "",
  branchId: "",
  capitalizedAmount: "",
  additionalSharesWillingToBuy: 0,
  decision: DividendDecisionType.FullyCapitalize,
} as any;

export const DividendActionDialog = ({
  onClose,
  // disabled,
  dividends,
}: {
  dividends: DividendDecisionSummaryDto;
  onClose: () => void;
  disabled?: boolean;
}) => {
  const [formData, setFormData] = useState<DividendActionFormData>();

  const [distribution, setDistribution] = useState<
    { evaluation: DividendComputationResult; decision?: DividendDecisionDto }[]
  >([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [dividendComputationResults, setDividendComputationResults] =
    useState<DividendComputationResults>();

  const { currentParValue } = useParValue();

  const { dividendDecisionLookups } = useDividendDecisionLookup();
  const [
    evaluateDecisions,
    { isLoading, isError, error: evaluateDecisionsErrors },
  ] = useEvaluateDividendDecisionMutation();

  const { branchLookups } = useBranches();
  const { districtLookups } = useDistricts();

  const [submitDividendDecision, { error: submitDividendDecisionErrors }] =
    useSubmitDividendDecisionMutation();

  const permissions = usePermission();

  const { showErrorAlert, showSuccessAlert } = useAlert();
  const hasError = useMemo(() => !!Object.keys(errors || {}).length, [errors]);

  const handleDividendDecision = useCallback(
    (decision: DividendDecisionType, amountToCapitalize: number = 0) => {
      // if (hasError) return;
      const _amountToCapitalize =
        decision === DividendDecisionType.FullyCapitalize
          ? dividends.totalDividendPayment
          : decision === DividendDecisionType.FullyPay
          ? 0
          : amountToCapitalize || 0;

      const ids = dividends?.decisions?.map((x) => x.id).filter((id) => !!id);

      if (ids?.length) {
        evaluateDecisions({
          computeDividendDecisionCommand: {
            decisionIds: ids as any,
            amountToCapitalize: _amountToCapitalize,
          },
        })
          .unwrap()
          .then((data) => {
            setDividendComputationResults(data);
            setDistribution(
              (data.results || []).map((evaluation) => ({
                evaluation,
                decision: dividends.decisions?.find(
                  (d) => d.id === evaluation.id
                ),
              }))
            );
          })
          .catch(() => {
            showErrorAlert("Error Occurred");
          });
      }
    },
    [
      dividends.decisions,
      dividends.totalDividendPayment,
      evaluateDecisions,
      showErrorAlert,
    ]
  );

  const processDividendDecision = useCallback(
    debounce(handleDividendDecision, 400),
    [handleDividendDecision]
  );

  useEffect(() => {
    return () => {
      processDividendDecision.cancel();
    };
  }, [processDividendDecision]);

  // useEffect(() => {
  //   processDividendDecision(selectedDecision, amountToCapitalize);
  // }, [amountToCapitalize, processDividendDecision, selectedDecision]);

  useEffect(() => {
    setErrors(
      ((evaluateDecisionsErrors || submitDividendDecisionErrors) as any)?.data
        ?.errors
    );
  }, [evaluateDecisionsErrors, submitDividendDecisionErrors]);

  const onSubmit = useCallback(
    (values: DividendActionFormData) => {
      const _amountToCapitalize =
        values.decision === DividendDecisionType.FullyCapitalize
          ? dividends.totalDividendPayment
          : values.decision === DividendDecisionType.FullyPay
          ? 0
          : values.capitalizedAmount;

      const ids = dividends?.decisions?.map((x) => x.id).filter((id) => !!id);

      const payload: SaveDividendDecisionCommand = {
        decisionIds: ids as any,
        amountToCapitalize: _amountToCapitalize,
        branchId: values.branchId,
        districtId: values.districtId,
        decisionDate:
          (values.decisionDate &&
            dayjs(values.decisionDate).format("YYYY-MM-DD")) ||
          undefined,
        additionalSharesWillingToBuy: values.additionalSharesWillingToBuy || 0,
      };

      submitDividendDecision({
        saveDividendDecisionCommand: removeEmptyFields(payload),
      })
        .unwrap()
        .then(() => {
          showSuccessAlert("Saved");
          onClose();
        })
        .catch(() => {
          showErrorAlert("Error Occurred");
        });
    },
    [
      dividends?.decisions,
      dividends.totalDividendPayment,
      onClose,
      showErrorAlert,
      showSuccessAlert,
      submitDividendDecision,
    ]
  );

  useEffect(() => {
    setFormData({
      ...emptyFormData,
      decisionDate: dividends?.decisions?.at(0)?.decisionDate
        ? dayjs(dividends?.decisions?.at(0)?.decisionDate)
        : dayjs(),
      branchId: dividends?.decisions?.at(0)?.branchId || "",
      districtId: dividends?.decisions?.at(0)?.districtId || "",
      additionalSharesWillingToBuy:
        dividends?.decisions?.find((x) => x.additionalSharesWillingToBuy)
          ?.additionalSharesWillingToBuy || 0,
    });
  }, [dividends?.decisions]);

  const formDataRef = useRef<DividendActionFormData | undefined>(formData);

  const disabled = !permissions.canCreateOrUpdateShareholderInfo;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      fullWidth
      maxWidth={"xl"}
      open={true}
    >
      {!!formData && currentParValue && (
        <Formik
          initialValues={formData}
          enableReinitialize={true}
          onSubmit={onSubmit}
          validationSchema={validationSchema(currentParValue)}
          validateOnChange={true}
        >
          {({ values, setValues, errors: _errors }) => {
            if (
              values.decision !== DividendDecisionType.PartiallyCapitalize &&
              values.capitalizedAmount !== 0
            ) {
              setValues({ ...values, capitalizedAmount: 0 });
            }

            if (
              formDataRef.current?.decision !== values.decision ||
              formDataRef.current.capitalizedAmount !== values.capitalizedAmount
            ) {
              processDividendDecision(
                values.decision,
                values.capitalizedAmount
              );
            }

            formDataRef.current = values;

            return (
              <Form>
                <DialogHeader title={"Dividend Action"} onClose={onClose} />
                <DialogContent dividers={true}>
                  <Grid container spacing={2}>
                    {hasError && (
                      <Grid item xs={12}>
                        <Errors errors={errors as any} />
                      </Grid>
                    )}

                    <Grid item xs={4}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <FormTextField
                          sx={{ flex: 1 }}
                          name="decisionDate"
                          type="date"
                          label={"Decision Date"}
                          // disabled={readOnly}
                        />
                        {/* <DatePicker
                label={"Decision Date"}
                value={decisionDate}
                // maxDate={to || undefined}
                disableFuture
                onChange={setDecisionDate}
                sx={{ flex: 1 }}
                slotProps={{ textField: { size: "small" } }}
              /> */}
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <FormSelectField
                        name="districtId"
                        type="number"
                        placeholder="District"
                        label="District"
                        options={districtLookups}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FormSelectField
                        name="branchId"
                        type="number"
                        placeholder="Branch"
                        label="Branch"
                        options={branchLookups}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ mb: 3, mt: 1 }} />
                    </Grid>
                    <Grid item xs={12}>
                      <FormSelectField
                        name="decision"
                        type="number"
                        placeholder="Action"
                        label="Action"
                        options={dividendDecisionLookups}
                      />

                      {/* <TextField
                      name="decision"
                      type="number"
                      placeholder="Action"
                      label="Action"
                      value={selectedDecision}
                      select={true}
                      onChange={(event) => {
                        setSelectedDecision(+event.target.value);
                      }}
                      fullWidth
                    >
                      {dividendDecisionLookups.map((item, index) => (
                        <MenuItem key={index} value={item.value as any}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </TextField> */}
                    </Grid>

                    {values.decision ===
                      DividendDecisionType.PartiallyCapitalize && (
                      <Grid item xs={12}>
                        <FormTextField
                          name="capitalizedAmount"
                          type="number"
                          placeholder="Amount to Capitalize"
                          label="Amount to Capitalize"
                          alwaysShowError={true}
                        />
                        {/* <Box sx={{ display: "flex", gap: 2 }}>
                        <TextField
                          sx={{ flex: 1 }}
                          name="capitalizedAmount"
                          type="number"
                          label="Amount to Capitalize"
                          value={Number(amountToCapitalize).toString()}
                          onChange={(event) => {
                            const value = +event.target.value;
                            onAmountToCapitalizeChange(value);
                          }}
                        />
                      </Box> */}
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Box sx={{ pb: 3 }}>
                        <DividendsList
                          data={distribution}
                          showSpinner={!isError && isLoading}
                          dividendComputationResults={
                            dividendComputationResults
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography>
                        If a chance was given to buy more shares, how much
                        additional shares would you like to buy?
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <FormTextField
                        name="additionalSharesWillingToBuy"
                        type="number"
                        label="Additional shares willing to buy (ETB)"
                        alwaysShowError={true}
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
                    disabled={disabled}
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

const DividendsList = ({
  data,
  showSpinner,
  dividendComputationResults,
}: {
  dividendComputationResults?: DividendComputationResults;
  data: {
    evaluation: DividendComputationResult;
    decision?: DividendDecisionDto;
  }[];
  showSpinner: boolean;
}) => {
  const { getDividendDecisionTypeLabel } = useDividendDecisionLookup();

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ display: "flex", justifyContent: "end", py: 2 }}>
        <Typography align="right" variant="overline">
          Total Capitalized{" "}
          <Typography
            component={"span"}
            fontStyle={"italic"}
            variant="overline"
          >
            (Capitalized + Fulfillment)
          </Typography>{" "}
          ={" "}
          <Typography
            color="success.main"
            variant="subtitle1"
            fontWeight={"bold"}
            component={"span"}
          >
            {formatNumber(
              (dividendComputationResults?.totalCapitalized || 0) +
                (dividendComputationResults?.totalFulfillment || 0),
              2
            )}{" "}
            ETB
          </Typography>
        </Typography>
      </Box>
      <Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width={80}>Dividend Period</TableCell>

                <TableCell align="left" width={130}>
                  Action
                </TableCell>
                <TableCell align="right">Dividend Payment</TableCell>
                <TableCell align="right">Capitalization Limit</TableCell>
                <TableCell align="right">Capitalized Amount</TableCell>
                <TableCell align="right">Fulfillment Amount</TableCell>
                <TableCell align="right">Withdrawal</TableCell>
                <TableCell align="right">Tax</TableCell>
                <TableCell align="right">Net Pay</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...(data || [])].map((d) => (
                <Fragment key={d.decision?.id}>
                  <TableRow>
                    <TableCell width={80}>
                      <DividendPeriodTooltip decision={d.decision!} />
                    </TableCell>

                    <TableCell align="left" width={100}>
                      <Typography
                        variant="subtitle2"
                        component="span"
                        color="info.main"
                      >
                        {getDividendDecisionTypeLabel(d.evaluation?.decision)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        {formatNumber(d.decision?.dividend?.dividendAmount, 3)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        {formatNumber(d.decision?.dividend?.capitalizeLimit, 3)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {formatNumber(d.evaluation?.capitalizedAmount, 3)}
                    </TableCell>
                    <TableCell align="right">
                      {formatNumber(d.evaluation?.fulfillmentAmount, 3) || 0}
                    </TableCell>
                    <TableCell align="right">
                      {formatNumber(d.evaluation?.withdrawnAmount, 3) || 0}
                    </TableCell>
                    <TableCell align="right">
                      {formatNumber(d.evaluation.tax, 3)}
                    </TableCell>
                    <TableCell align="right">
                      {formatNumber(d.evaluation.netPay, 3)}
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
              <TableRow
                sx={{
                  " > *": { borderBottom: "0 !important" },
                }}
              >
                <TableCell colSpan={2} align="right" sx={{ py: 2 }}>
                  <Typography variant="subtitle2" fontWeight={"bold"}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ flex: 1 }}></Box>
                      TOTAL
                    </Box>
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography variant="subtitle1" fontWeight={"bold"}>
                    {formatNumber(
                      dividendComputationResults?.totalDividends,
                      2
                    )}
                  </Typography>
                </TableCell>
                <TableCell></TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle1" fontWeight={"bold"}>
                    {formatNumber(
                      dividendComputationResults?.totalCapitalized,
                      3
                    )}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {" "}
                  <Typography variant="subtitle1" fontWeight={"bold"}>
                    {formatNumber(
                      dividendComputationResults?.totalFulfillment,
                      2
                    ) || 0}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {" "}
                  <Typography variant="subtitle1" fontWeight={"bold"}>
                    {formatNumber(
                      dividendComputationResults?.totalWithdrawn,
                      2
                    ) || 0}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {" "}
                  <Typography variant="subtitle1" fontWeight={"bold"}>
                    {formatNumber(dividendComputationResults?.totalTax, 3)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {" "}
                  <Typography variant="subtitle1" fontWeight={"bold"}>
                    {formatNumber(dividendComputationResults?.totalNetPay, 3)}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* <Box sx={{ display: "flex", justifyContent: "start", py: 2 }}>
        <Typography align="right">
          TOTAL Capitalized{" "}
          <Typography component={"span"} fontStyle={"italic"}>
            (capitalized amount + fulfillment)
          </Typography>{" "}
          ={" "}
          <Typography
            color="success.main"
            variant="subtitle1"
            fontWeight={"bold"}
            component={"span"}
          >
            {formatNumber(
              (dividendComputationResults?.totalCapitalized || 0) +
                (dividendComputationResults?.totalFulfillment || 0),
              2
            )}{" "}
            ETB
          </Typography>
        </Typography>
      </Box> */}
      {showSpinner && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 1,
            backgroundColor: "rgba(0,0,0,0.05)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        </Box>
      )}
    </Box>
  );
};
