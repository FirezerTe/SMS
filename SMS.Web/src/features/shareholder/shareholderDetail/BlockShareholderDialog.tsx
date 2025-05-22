import { Box, Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { Dialog, DialogActions, DialogContent } from "@mui/material";

import { Grid } from "@mui/material";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import * as yup from "yup";
import {
  ShareholderBlockDetail,
  ShareholderSubscriptionsSummary,
  useGetShareholderSubscriptionSummaryQuery,
} from "../../../app/api";
import { ShareUnit } from "../../../app/api/enums";
import {
  DialogHeader,
  FormSelectField,
  FormTextField,
} from "../../../components";
import { YupShape } from "../../../utils";
import { formatNumber } from "../../common";
import { useBlockReasons } from "./useBlockReason";
import { useBlockTypes } from "./useBlockType";

const emptyBlockageData: ShareholderBlockDetail = {
  id: "",
  amount: "",
  unit: "",
  description: "",
  blockedTill: "",
  shareholderId: "",
  blockTypeId: "",
  blockReasonId: "",
  effectiveDate: dayjs().format("YYYY-MM-DD"),
} as any;

const validationSchema = (
  subscriptionSummary?: ShareholderSubscriptionsSummary
) =>
  yup.object<YupShape<ShareholderBlockDetail>>({
    id: yup.number().optional(),
    amount: yup
      .number()
      .moreThan(0, "Should be positive number")
      .optional()
      .test("", (value, { createError }) => {
        if (!value) return true;
        return !!subscriptionSummary?.totalApprovedPayments &&
          value > subscriptionSummary.totalApprovedPayments
          ? createError({
              message: `Cannot block more than total approved payments (${formatNumber(
                subscriptionSummary.totalApprovedPayments
              )} ETB)`,
              path: "amount",
            })
          : true;
      }),

    unit: yup.number().optional(),
    description: yup.string().required("Description is required"),
    blockTypeId: yup.number().required("Type is required"),
    blockReasonId: yup.number().required("Reason type is required"),
    effectiveDate: yup.date().nullable().required("Effective Date is required"),
  });

export const BlockShareholderDialog = ({
  blockage,
  shareholderId,
  onClose,
  onSubmit,
}: {
  shareholderId: number;
  onClose: () => void;
  onSubmit: (blockage?: ShareholderBlockDetail) => void;
  blockage?: ShareholderBlockDetail;
}) => {
  const [blockageData, setBlockageData] = useState<ShareholderBlockDetail>();
  const { blockReasonLookups } = useBlockReasons();
  const { blockTypeLookups } = useBlockTypes();
  const { data: subscriptionSummary } =
    useGetShareholderSubscriptionSummaryQuery(
      {
        id: shareholderId,
      },
      { skip: !shareholderId }
    );

  useEffect(() => {
    setBlockageData({
      ...emptyBlockageData,
      ...blockage,
      shareholderId,
      blockTypeId: blockage
        ? blockage.blockTypeId
        : (blockTypeLookups?.length && (blockTypeLookups[0].value as number)) ||
          undefined,
      blockReasonId: blockage
        ? blockage.blockReasonId
        : (blockReasonLookups?.length &&
            (blockReasonLookups[0].value as number)) ||
          undefined,
      unit: blockage?.unit || ShareUnit.Birr,
    });
  }, [blockage, blockReasonLookups, shareholderId, blockTypeLookups]);

  const handleSubmit = useCallback(
    async (values: ShareholderBlockDetail) => {
      onSubmit(values);
    },
    [onSubmit]
  );

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={true}
    >
      {!!blockageData && (
        <Formik
          initialValues={blockageData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={validationSchema(subscriptionSummary)}
          validateOnChange={true}
        >
          {() => {
            return (
              <Form>
                <DialogHeader title={"Block Shareholder"} onClose={onClose} />
                <DialogContent dividers={true} sx={{ width: 600 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormSelectField
                        name="blockReasonId"
                        type="number"
                        placeholder="Reason"
                        label="Reason"
                        options={blockReasonLookups}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormSelectField
                        name="blockTypeId"
                        type="number"
                        placeholder="Type"
                        label="Type"
                        options={blockTypeLookups}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        sx={{ flex: 1 }}
                        name="effectiveDate"
                        type="date"
                        label="Effective Date"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        fullWidth
                        multiline
                        minRows={5}
                        label="Description"
                        name="description"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <FormTextField
                            name="amount"
                            type="number"
                            placeholder="Amount (ETB)"
                            label="Amount (ETB)"
                          />
                        </Box>
                        {/* <Box sx={{ flex: 1 }}>
                          <FormRadioButtonGroup
                            name="unit"
                            label=""
                            type="number"
                            options={[
                              {
                                label: "Birr",
                                value: ShareUnit.Birr,
                              },
                              {
                                label: "Share",
                                value: ShareUnit.Share,
                              },
                            ]}
                          />
                        </Box> */}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <FormTextField
                        name="blockedTill"
                        type="date"
                        label="Block Until"
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                  <Button onClick={onClose} variant="outlined">
                    Cancel
                  </Button>
                  <Button color="primary" variant="contained" type="submit">
                    Submit
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
