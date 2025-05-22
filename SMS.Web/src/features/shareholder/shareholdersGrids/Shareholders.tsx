import { Box, Button, Divider, Paper } from "@mui/material";
import { useCallback, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import GroupsIcon from "@mui/icons-material/Groups";
import dayjs from "dayjs";
import { Outlet } from "react-router-dom";
import {
  ShareholderBasicInfo,
  useAddNewShareholderMutation,
  useGetShareholderCountPerApprovalStatusQuery,
} from "../../../app/api";
import { PageHeader } from "../../../components";
import { usePermission } from "../../../hooks";
import { removeEmptyFields } from "../../../utils";
import { SearchShareholder } from "../SearchShareholder";
import { ShareholderBasicInfoDialog } from "../shareholderDetail/summaryTab/ShareholderBasicInfoDialog";
import { ShareholderListTabs } from "./ShareholderListTabs";

export const Shareholders = () => {
  const [add, { error, reset }] = useAddNewShareholderMutation();
  const permissions = usePermission();

  const { data: shareholderCounts } =
    useGetShareholderCountPerApprovalStatusQuery();

  const [open, setOpen] = useState(false);

  const handleRegister = useCallback(() => {
    !open && setOpen(true);
  }, [open]);

  const handleClose = useCallback(() => {
    reset();
    setOpen(false);
  }, [reset]);

  const handleSubmit = useCallback(
    ({
      name,
      middleName,
      lastName,
      amharicName,
      amharicMiddleName,
      amharicLastName,
      accountNumber,
      gender,
      countryOfCitizenship,
      ethiopianOrigin,
      passportNumber,
      shareholderType,
      tinNumber,
      fileNumber,
      isOtherBankMajorShareholder,
      hasRelatives,
      registrationDate,
      dateOfBirth,
    }: ShareholderBasicInfo) => {
      const data = {
        name,
        middleName,
        lastName,
        amharicName,
        amharicMiddleName,
        amharicLastName,
        accountNumber,
        gender,
        countryOfCitizenship,
        ethiopianOrigin,
        passportNumber,
        shareholderType,
        tinNumber,
        fileNumber,
        isOtherBankMajorShareholder,
        hasRelatives,
        registrationDate:
          registrationDate && dayjs(registrationDate).format("YYYY-MM-DD"),
        dateOfBirth: dateOfBirth && dayjs(dateOfBirth).format("YYYY-MM-DD"),
      };

      add({
        createShareholderCommand: removeEmptyFields({
          ...data,
          gender: Number(gender) as any,
        }),
      })
        .unwrap()
        .then(handleClose)
        .catch(() => {});
    },
    [add, handleClose]
  );

  return (
    <Box>
      <PageHeader
        icon={
          <GroupsIcon sx={{ fontSize: "inherit", verticalAlign: "middle" }} />
        }
        title={"Shareholders"}
      />
      <Box sx={{ display: "flex", my: 2 }}>
        <SearchShareholder />

        <Box sx={{ flex: 1 }}></Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleRegister}
            disabled={!permissions.canCreateOrUpdateShareholderInfo}
          >
            Add New Shareholder
          </Button>
        </Box>
      </Box>
      <Paper sx={{ p: 2, flex: 1 }}>
        <ShareholderListTabs counts={shareholderCounts} />
        <Divider />
        <Outlet />
      </Paper>
      <ShareholderBasicInfoDialog
        title="New Shareholder"
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        errors={(error as any)?.data?.errors}
      />
    </Box>
  );
};
