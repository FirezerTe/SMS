import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import {
  ShareholderBasicInfo as ShareholderBasicInfo_,
  useGetAllLookupsQuery,
  useGetShareholderInfoQuery,
  useUpdateShareholderMutation,
} from "../../../../app/api";
import {
  ShareholderChangeLogEntityType,
  ShareholderType,
} from "../../../../app/api/enums";
import { ContentCard, KeyValuePair } from "../../../../components";
import {
  getChangelogStyle,
  getGenderLabel,
  removeEmptyFields,
} from "../../../../utils";
import { useCountries } from "../../../countries";
import { useAlert } from "../../../notification";
import { useCurrentVersion } from "../../useCurrentVersion";
import { useShareholderChangeLogs } from "../shareholderChangeLog";
import { ShareholderBasicInfoDialog } from "./ShareholderBasicInfoDialog";
import { ShareholderSignature } from "./ShareholderSignature";

export const ShareholderInfo = ({
  id,
  version,
}: {
  id: number;
  version?: string;
}) => {
  const { data: shareholderInfo } = useGetShareholderInfoQuery(
    {
      id,
      version,
    },
    {
      skip: !id,
    }
  );
  const { showErrorAlert } = useAlert();
  const { data: lookups } = useGetAllLookupsQuery();
  const { countries } = useCountries();
  const { loadCurrentVersion } = useCurrentVersion();
  const [updateShareholderInfo, updateShareholderInfoResponse] =
    useUpdateShareholderMutation();

  const [shareholderInfoDialogOpened, setShareholderInfoDialogOpened] =
    useState(false);

  const { changeLogs } = useShareholderChangeLogs();

  const onShareholderInfoUpdate = useCallback(
    async ({
      id,
      name,
      middleName,
      lastName,
      amharicName,
      amharicMiddleName,
      amharicLastName,
      countryOfCitizenship,
      ethiopianOrigin,
      passportNumber,
      accountNumber,
      tinNumber,
      fileNumber,
      isOtherBankMajorShareholder,
      hasRelatives,
      shareholderType,
      registrationDate,
      gender,
      dateOfBirth,
    }: ShareholderBasicInfo_) => {
      if (id) {
        const data = removeEmptyFields({
          id,
          name,
          middleName,
          lastName,
          amharicName,
          amharicMiddleName,
          amharicLastName,
          countryOfCitizenship,
          ethiopianOrigin,
          passportNumber,
          accountNumber,
          tinNumber,
          fileNumber,
          isOtherBankMajorShareholder,
          hasRelatives,
          gender,
          registrationDate:
            registrationDate && dayjs(registrationDate).format("YYYY-MM-DD"),
          shareholderType,
          dateOfBirth: dateOfBirth && dayjs(dateOfBirth).format("YYYY-MM-DD"),
        });
        const result = await updateShareholderInfo({
          id,
          updateShareholderCommand: data,
        });

        if ("error" in result) {
          (result.error as any)?.status != 403 &&
            showErrorAlert(
              "An error occurred while saving your changes. Please try again."
            );
        } else {
          closeDialog();
          loadCurrentVersion();
        }
      }
    },
    [loadCurrentVersion, showErrorAlert, updateShareholderInfo]
  );

  const closeDialog = () => {
    setShareholderInfoDialogOpened(false);
  };

  const {
    countryOfCitizenship,
    shareholderType,
    shareholderStatus,
    isEthiopianOrigin,
    passportNumber,
    isEthiopian,
  } = useMemo(() => {
    const countryOfCitizenship = countries?.find(
      (c) => c.id === shareholderInfo?.countryOfCitizenship
    );
    const shareholderType = lookups?.shareholderTypes?.find(
      (t) => t.value === shareholderInfo?.shareholderType
    );

    const shareholderStatus = lookups?.shareholderStatuses?.find(
      (s) => s.value === shareholderInfo?.shareholderStatus
    );

    const isEthiopian = countryOfCitizenship?.code === "ETH";

    return {
      countryOfCitizenship,
      shareholderType,
      shareholderStatus,
      isEthiopianOrigin: shareholderInfo?.ethiopianOrigin,
      passportNumber: shareholderInfo?.passportNumber,
      isEthiopian,
    };
  }, [
    countries,
    lookups?.shareholderStatuses,
    lookups?.shareholderTypes,
    shareholderInfo,
  ]);

  const changeLog = useMemo(
    () =>
      changeLogs?.find(
        (c) =>
          c.entityType === ShareholderChangeLogEntityType.BasicInfo &&
          c.entityId === shareholderInfo?.id
      ),
    [changeLogs, shareholderInfo?.id]
  );

  return (
    <>
      <ContentCard>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography sx={{ my: 1 }}>Personal Information</Typography>
          <Button
            onClick={() =>
              !shareholderInfoDialogOpened &&
              setShareholderInfoDialogOpened(true)
            }
            variant="text"
            startIcon={<EditIcon />}
            size="small"
            color="success"
          >
            Edit
          </Button>
        </Box>
        <Box sx={getChangelogStyle(changeLog)}>
          <KeyValuePair
            label="Shareholder #"
            value={
              !shareholderInfo?.shareholderNumber
                ? " - "
                : shareholderInfo?.shareholderNumber
            }
          />
          <KeyValuePair
            label="Registration Date"
            value={
              !shareholderInfo?.registrationDate
                ? " - "
                : dayjs(shareholderInfo?.registrationDate).format(
                    "MMMM D, YYYY"
                  )
            }
          />
          <KeyValuePair
            label="Account #"
            value={
              !shareholderInfo?.accountNumber
                ? " - "
                : shareholderInfo?.accountNumber
            }
          />
          {shareholderInfo?.shareholderType === ShareholderType.Individual && (
            <KeyValuePair
              label="Gender"
              value={getGenderLabel(shareholderInfo?.gender)}
            />
          )}
          {shareholderInfo?.shareholderType === ShareholderType.Individual && (
            <KeyValuePair
              label="Citizenship"
              value={countryOfCitizenship?.nationality || ""}
            />
          )}
          {!isEthiopian && (
            <>
              {shareholderInfo?.shareholderType ===
                ShareholderType.Individual && (
                <KeyValuePair
                  label="Is Ethiopian Origin"
                  value={
                    isEthiopianOrigin === true
                      ? "Yes"
                      : isEthiopianOrigin === false
                      ? "No"
                      : ""
                  }
                />
              )}
              {shareholderInfo?.shareholderType ===
                ShareholderType.Individual && (
                <KeyValuePair
                  label="Passport Number"
                  value={passportNumber || ""}
                />
              )}
            </>
          )}
          {shareholderInfo?.shareholderType === ShareholderType.Individual && (
            <KeyValuePair
              label="Date of Birth"
              value={
                shareholderInfo?.dateOfBirth
                  ? dayjs(shareholderInfo?.dateOfBirth).format("MMMM D, YYYY")
                  : "- "
              }
            />
          )}
          {shareholderInfo && (
            <>
              <KeyValuePair label="Type" value={shareholderType?.displayName} />
              <KeyValuePair label="Status" value={shareholderStatus?.name} />
              <KeyValuePair
                label="Tin#"
                value={shareholderInfo.tinNumber || ""}
              />
              <KeyValuePair
                label="File#"
                value={shareholderInfo.fileNumber || ""}
              />
              <KeyValuePair label="Signature">
                <Box sx={{ width: 150 }}>
                  <ShareholderSignature shareholder={shareholderInfo} />
                </Box>
              </KeyValuePair>
            </>
          )}
        </Box>
      </ContentCard>
      {shareholderInfo && (
        <ShareholderBasicInfoDialog
          title="Edit Shareholder"
          open={shareholderInfoDialogOpened}
          onClose={closeDialog}
          shareholder={shareholderInfo}
          onSubmit={onShareholderInfoUpdate}
          errors={(updateShareholderInfoResponse.error as any)?.data?.errors}
        />
      )}
    </>
  );
};
