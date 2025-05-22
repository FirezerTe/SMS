import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { ShareholderBasicInfo, enums } from "../../../../app/api";
import { ShareholderType } from "../../../../app/api/enums";
import {
  DialogHeader,
  Errors,
  FormRadioButtonGroup,
  FormSelectField,
  FormTextField,
} from "../../../../components";
import { usePermission } from "../../../../hooks";
import { AllowedAmharicCharacters, YupShape } from "../../../../utils";
import { useCountries } from "../../../countries";
import { useShareholderTypes } from "../../useShareholderTypes";

const validationSchema = ({
  isEthiopian,
}: {
  isEthiopian: (countryId?: number) => boolean;
}) =>
  yup.object<YupShape<ShareholderBasicInfo>>({
    id: yup.number().nullable().optional(),
    shareholderType: yup.number().required("Type is required"),
    name: yup.string().nonNullable().required("Name is required"),
    lastName: yup
      .string()
      .nullable()
      .when("shareholderType", ([type], schema) => {
        return type === ShareholderType.Individual
          ? schema.required("Last Name is required")
          : schema.optional();
      }),
    middleName: yup
      .string()
      .nullable()
      .when("shareholderType", ([type], schema) => {
        return type === ShareholderType.Individual
          ? schema.required("Middle Name is required")
          : schema.optional();
      }),

    amharicName: yup
      .string()
      .matches(AllowedAmharicCharacters, "አማረኛ ቃላት ብቻ ተጠቀሙ")
      .required("ስም ያስፈልጋል"),
    amharicLastName: yup
      .string()
      .nullable()
      .matches(AllowedAmharicCharacters, "አማረኛ ቃላት ብቻ ተጠቀሙ")
      .when("shareholderType", ([type], schema) =>
        type === ShareholderType.Individual
          ? schema.required("የአያት ስም ያስፈልጋል")
          : schema.optional()
      ),
    amharicMiddleName: yup
      .string()
      .nullable()
      .matches(AllowedAmharicCharacters, "አማረኛ ቃላት ብቻ ተጠቀሙ")
      .when("shareholderType", ([type], schema) =>
        type === ShareholderType.Individual
          ? schema.required("የአባት ስም ያስፈልጋል")
          : schema.optional()
      ),
    gender: yup
      .number()
      .nullable()
      .when("shareholderType", ([type], schema) =>
        type === ShareholderType.Individual
          ? schema.required("Gender is required")
          : schema.optional()
      ),
    countryOfCitizenship: yup
      .number()
      .nullable()
      .when("shareholderType", ([type], schema) =>
        type === ShareholderType.Individual
          ? schema.required("Country Of Citizenship is required")
          : schema.optional()
      ),
    dateOfBirth: yup
      .date()
      .nullable()
      .test("", (value, { createError }) => {
        return !value || dayjs().isAfter(value)
          ? true
          : createError({
              message: `Date of Birth cannot be future date`,
              path: "dateOfBirth",
            });
      }),

    ethiopianOrigin: yup
      .boolean()
      .nullable()
      .when(
        ["countryOfCitizenship", "shareholderType"],
        ([countryOfCitizenship, type], schema) =>
          isEthiopian(countryOfCitizenship) ||
          type !== ShareholderType.Individual
            ? schema.optional()
            : schema.required("Required")
      ),
    passportNumber: yup
      .string()
      .nullable()
      .when(
        ["countryOfCitizenship", "shareholderType"],
        ([countryOfCitizenship, type], schema) =>
          isEthiopian(countryOfCitizenship) ||
          type !== ShareholderType.Individual
            ? schema.optional()
            : schema.required("Passport Number is required")
      ),
    tinNumber: yup.string().nullable(),
    fileNumber: yup.string().nullable(),
    accountNumber: yup.string().nullable(),
    hasRelatives: yup.boolean().required("Required"),
    isOtherBankMajorShareholder: yup.boolean().required("Required"),
    registrationDate: yup
      .date()
      .nullable()
      .required("Registration Date is required")
      .test("", (value, { createError }) => {
        return !value || dayjs().isAfter(value)
          ? true
          : createError({
              message: `Registration Date cannot be future date`,
              path: "registrationDate",
            });
      }),
  });

const emptyShareholder: ShareholderBasicInfo = {
  name: "",
  lastName: "",
  middleName: "",
  displayName: "",
  amharicName: "",
  amharicLastName: "",
  amharicMiddleName: "",
  amharicDisplayName: "",
  tinNumber: "",
  fileNumber: "",
  gender: "",
  isOtherBankMajorShareholder: "",
  hasRelatives: "",
  accountNumber: "",
  ethiopianOrigin: true,
  shareholderType: ShareholderType.Individual,
  dateOfBirth: "",
  registrationDate: "",
} as any;

export const ShareholderBasicInfoDialog = ({
  title,
  shareholder,
  open = false,
  onSubmit,
  onClose,
  errors,
}: {
  title: string;
  shareholder?: ShareholderBasicInfo;
  open: boolean;
  onSubmit: (shareholder: ShareholderBasicInfo) => void;
  errors?: { [key: string]: string };
  onClose: () => void;
}) => {
  const { countries, defaultCountryId, countryLookups, getCountryById } =
    useCountries();
  const { shareholderTypeLookups } = useShareholderTypes();
  const permissions = usePermission();

  const [shareholderInfo, setShareholderInfo] =
    useState<ShareholderBasicInfo>();

  useEffect(() => {
    setShareholderInfo({
      ...emptyShareholder,
      ...shareholder,
      countryOfCitizenship:
        shareholder?.countryOfCitizenship ||
        defaultCountryId ||
        (countries && countries[0]?.id),
    });
  }, [countries, defaultCountryId, shareholder]);

  const handleSubmit = useCallback(
    async (values: ShareholderBasicInfo) => {
      await onSubmit(values);
    },
    [onSubmit]
  );

  const isEthiopian = useCallback(
    (countryId?: number) =>
      countries &&
      !!countryId &&
      getCountryById(countryId)?.name?.toLowerCase() === "ethiopia",
    [countries, getCountryById]
  );

  const _validationSchema = useMemo(
    () => validationSchema({ isEthiopian }),
    [isEthiopian]
  );

  const disabled = !permissions.canCreateOrUpdateShareholderInfo;

  return (
    <Dialog
      scroll={"paper"}
      disableEscapeKeyDown={true}
      maxWidth={"md"}
      open={open}
    >
      {!!shareholderInfo && (
        <Formik
          initialValues={shareholderInfo}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={_validationSchema}
          validateOnChange={true}
        >
          {({ values }) => {
            const isIndividual =
              values.shareholderType === ShareholderType.Individual;
            const isNew = !shareholderInfo.id;
            return (
              <Form>
                <DialogHeader title={title} onClose={onClose} />
                <DialogContent dividers={true}>
                  <Grid container spacing={2}>
                    {errors && !!Object.keys(errors)?.length && (
                      <Grid item xs={12}>
                        <Errors errors={errors} />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Grid container spacing={2}>
                            <Grid item xs={isNew ? 6 : 12}>
                              <Box sx={{ display: "flex", gap: 2 }}>
                                <FormTextField
                                  sx={{ flex: 1 }}
                                  name="registrationDate"
                                  type="date"
                                  label="Registration Date"
                                  disabled={disabled}
                                />
                              </Box>
                            </Grid>
                            {isNew && (
                              <Grid item xs={6}>
                                <FormSelectField
                                  name="shareholderType"
                                  type="number"
                                  placeholder="Shareholder Type"
                                  label="Shareholder Type"
                                  options={shareholderTypeLookups}
                                  disabled={disabled}
                                />
                              </Grid>
                            )}
                            <Grid
                              item
                              xs={12}
                              sm={(isIndividual && 6) || 12}
                              md={(isIndividual && 4) || 12}
                            >
                              <FormTextField
                                name="name"
                                type="text"
                                placeholder={`${
                                  (isIndividual && "First ") || ""
                                }Name`}
                                label={`${
                                  (isIndividual && "First ") || ""
                                }Name`}
                                disabled={disabled}
                              />
                            </Grid>
                            {isIndividual && (
                              <>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormTextField
                                    name="middleName"
                                    type="text"
                                    placeholder="Middle Name"
                                    label="Middle Name"
                                    disabled={disabled}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormTextField
                                    name="lastName"
                                    type="text"
                                    placeholder="Last Name"
                                    label="Last Name"
                                    disabled={disabled}
                                  />
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={2}>
                            <Grid
                              item
                              xs={12}
                              sm={(isIndividual && 6) || 12}
                              md={(isIndividual && 4) || 12}
                            >
                              <FormTextField
                                name="amharicName"
                                type="text"
                                placeholder="ስም"
                                label="ስም"
                                disabled={disabled}
                              />
                            </Grid>
                            {isIndividual && (
                              <>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormTextField
                                    name="amharicMiddleName"
                                    type="text"
                                    placeholder="የአባት ስም"
                                    label="የአባት ስም"
                                    disabled={disabled}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormTextField
                                    name="amharicLastName"
                                    type="text"
                                    placeholder="የአያት ስም"
                                    label="የአያት ስም"
                                    disabled={disabled}
                                  />
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </Grid>
                        {isIndividual && (
                          <>
                            <Grid item xs={6}>
                              <Box sx={{ display: "flex", gap: 2 }}>
                                <FormTextField
                                  sx={{ flex: 1 }}
                                  name="dateOfBirth"
                                  type="date"
                                  label="Date of Birth"
                                  disabled={disabled}
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <FormRadioButtonGroup
                                name="gender"
                                label="Gender"
                                type="number"
                                options={[
                                  {
                                    label: "Male",
                                    value: enums.Gender.Male,
                                  },
                                  {
                                    label: "Female",
                                    value: enums.Gender.Female,
                                  },
                                ]}
                                disabled={disabled}
                              />
                            </Grid>
                          </>
                        )}
                        {isIndividual && (
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <FormSelectField
                                  name="countryOfCitizenship"
                                  type="number"
                                  placeholder="Country of Citizenship"
                                  label="Country of Citizenship"
                                  options={countryLookups}
                                  onChange={() => {}}
                                  disabled={disabled}
                                />
                              </Grid>
                              {!isEthiopian(values.countryOfCitizenship) && (
                                <Grid item xs={12}>
                                  <Box sx={{ px: 4, mt: -1 }}>
                                    <FormRadioButtonGroup
                                      name="ethiopianOrigin"
                                      label="Are you Ethiopian origin?"
                                      type="boolean"
                                      disabled={disabled}
                                      options={[
                                        {
                                          label: "Yes",
                                          value: true,
                                        },
                                        {
                                          label: "No",
                                          value: false,
                                        },
                                      ]}
                                    />
                                  </Box>
                                </Grid>
                              )}
                              {!isEthiopian(values.countryOfCitizenship) && (
                                <Grid item xs={12}>
                                  <Box sx={{ px: 4, pb: 2 }}>
                                    <FormTextField
                                      sx={{ flex: 1 }}
                                      name="passportNumber"
                                      type="text"
                                      label="Passport Number"
                                      disabled={disabled}
                                    />
                                  </Box>
                                </Grid>
                              )}
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <FormTextField
                            name="tinNumber"
                            type="text"
                            placeholder="Tin Number"
                            label="Tin Number"
                            disabled={disabled}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormTextField
                            name="fileNumber"
                            type="text"
                            placeholder="File Number"
                            label="File Number"
                            disabled={disabled}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormTextField
                            name="accountNumber"
                            type="string"
                            placeholder="Account Number"
                            label="Account Number"
                            disabled={disabled}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}></Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}></Grid>
                        <Grid item xs={12}>
                          <FormRadioButtonGroup
                            name="isOtherBankMajorShareholder"
                            label="Do you own more than 2% of share of any other bank?"
                            type="boolean"
                            disabled={disabled}
                            options={[
                              {
                                label: "Yes",
                                value: true,
                              },
                              {
                                label: "No",
                                value: false,
                              },
                            ]}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormRadioButtonGroup
                            name="hasRelatives"
                            label="Do you have any relatives who own Berhan Bank shares?"
                            type="boolean"
                            disabled={disabled}
                            options={[
                              {
                                label: "Yes",
                                value: true,
                              },
                              {
                                label: "No",
                                value: false,
                              },
                            ]}
                          />
                        </Grid>
                      </Grid>
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
