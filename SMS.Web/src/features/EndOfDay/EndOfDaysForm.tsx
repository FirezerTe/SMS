import { FormHelperText, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { Errors, FormTextField, PageHeader } from "../../components";
import dayjs from "dayjs";
import { EndOfDayTransactionPull } from "./EndOfDaysTransactionPull";
import { EndOfDayDto } from "../../app/api";
import { values } from "lodash-es";
import { YupShape } from "../../utils";
import * as yup from "yup";
import { Checklist } from "@mui/icons-material";
const emptySubscriptionPayment = {
  effectiveDate: dayjs(),
};
const validationSchema = yup.object<YupShape<EndOfDayDto>>({
  description: yup.string().required("Description is required"),
});
export const EndOfDaysForm = () => {
  const [date, setDate] = useState<EndOfDayDto>();
  const [description, setDescription] = useState<EndOfDayDto>();
  const [TransactionInfo, setTransactionInfo] = useState<EndOfDayDto>();
  const errors = (values as any)?.data?.errors;

  const handleSubmit = useCallback(
    (values: EndOfDayDto) => {
      setDate(values);
      setDescription(values);
    },
    [date, description]
  );

  useEffect(() => {
    setTransactionInfo({
      ...TransactionInfo,
      ...emptySubscriptionPayment,
    });
  }, [TransactionInfo, date, emptySubscriptionPayment]);

  return (
    <Box>
      <Box>
        <div>
          {errors && (
            <Grid item xs={12}>
              <Errors errors={errors as any} />
            </Grid>
          )}
          <Formik
            initialValues={TransactionInfo as any}
            enableReinitialize={true}
            validationSchema={validationSchema}
            validateOnChange={true}
            onSubmit={(values) => handleSubmit(values)} // Pass the values to your handleSubmit function
          >
            {(formik) => (
              <Form>
                <PageHeader
                  icon={
                    <Checklist
                      sx={{ fontSize: "inherit", verticalAlign: "middle" }}
                    />
                  }
                  title={"End Of Day"}
                />
                <Grid container spacing={4}>
                  <Grid item xs={6} sm={6}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Grid item xs={6} sm={6}>
                        <FormTextField
                          name="date"
                          type="date"
                          placeholder="Transaction Date"
                          onChange={() => {
                            setDate(formik.values);
                          }}
                          label="Transaction Date"
                        />
                      </Grid>
                      <FormTextField
                        name="description"
                        type="text"
                        placeholder="Description"
                        label="Description"
                        multiline
                        minRows={1}
                        variant="outlined"
                        onChange={() => {
                          setDescription(formik.values);
                        }}
                      />
                    </Box>
                    <FormHelperText>Choose the Transaction Date</FormHelperText>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Button color="primary" variant="outlined" type="submit">
                      Import
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
        {!!date && (
          <>
            <div>
              <EndOfDayTransactionPull
                transactionDate={date as any}
                description={description as any}
              />
            </div>
          </>
        )}
      </Box>
    </Box>
  );
};
