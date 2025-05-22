import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  AddressDto,
  useAddShareholderAddressMutation,
  useGetShareholderAddressesQuery,
  useUpdateShareholderAddressMutation,
} from "../../../../app/api";
import { ShareholderChangeLogEntityType } from "../../../../app/api/enums";
import { ContentCard, KeyValuePair } from "../../../../components";
import { usePermission } from "../../../../hooks";
import { getChangelogStyle } from "../../../../utils";
import { useCountries } from "../../../countries";
import { useShareholderChangeLogs } from "../shareholderChangeLog";
import { AddressDialog } from "./AddressDialog";

export const ShareholderAddress = ({ id }: { id: number }) => {
  const { data: addresses } = useGetShareholderAddressesQuery(
    {
      id,
    },
    {
      skip: !id,
    }
  );

  const [addAddress, addAddressResponse] = useAddShareholderAddressMutation();
  const [updateAddress, updateAddressResponse] =
    useUpdateShareholderAddressMutation();

  const permissions = usePermission();

  const [addressDialogOpened, setAddressDialogOpened] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<
    AddressDto | undefined
  >();

  useEffect(() => {
    if (addAddressResponse.isSuccess || updateAddressResponse.isSuccess) {
      setSelectedAddress(undefined);
      setAddressDialogOpened(false);
      addAddressResponse.reset();
      updateAddressResponse.reset();
    }
  }, [addAddressResponse, updateAddressResponse]);

  const onAddressAddOrUpdate = useCallback(
    (addressDto: AddressDto) => {
      selectedAddress
        ? updateAddress({
            id,
            addressDto,
          })
        : addAddress({
            id,
            addressDto,
          });
    },
    [addAddress, id, selectedAddress, updateAddress]
  );

  const { getCountryById } = useCountries();

  const { changeLogs } = useShareholderChangeLogs();

  const getChangeLog = useCallback(
    (address: AddressDto) =>
      changeLogs?.find(
        (c) =>
          c.entityType === ShareholderChangeLogEntityType.Address &&
          c.entityId === address.id
      ),
    [changeLogs]
  );

  return (
    <>
      <ContentCard>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography sx={{ my: 1 }}>Address</Typography>

          <Button
            onClick={() => {
              setSelectedAddress(undefined);
              setAddressDialogOpened(true);
            }}
            variant="text"
            startIcon={<AddIcon />}
            size="small"
            color="success"
            disabled={!permissions.canCreateOrUpdateShareholderInfo}
          >
            New Address
          </Button>
        </Box>
        {(addresses || []).map((address, index) => (
          <Box
            key={`address-${address?.id}`}
            sx={getChangelogStyle(getChangeLog(address))}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                my: 1,
                position: "relative",
              }}
            >
              <Box sx={{ flex: 1 }}>
                {address?.countryId && (
                  <KeyValuePair
                    label="Country"
                    value={getCountryById(address.countryId)?.name || ""}
                  />
                )}
                <KeyValuePair label="City" value={address?.city} />
                <KeyValuePair label="Sub-City" value={address?.subCity} />
                <KeyValuePair label="Kebele" value={address?.kebele} />
                <KeyValuePair label="Woreda" value={address?.woreda} />
                <KeyValuePair
                  label="House Number"
                  value={address?.houseNumber}
                />
              </Box>
              {!!permissions.canCreateOrUpdateShareholderInfo && (
                <IconButton
                  sx={{ position: "absolute", right: 0 }}
                  onClick={() => {
                    setSelectedAddress(address);
                    setAddressDialogOpened(true);
                  }}
                  color="primary"
                  title="Edit"
                  size="small"
                  aria-label="edit"
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              )}
            </Box>
            {index !== (addresses || []).length - 1 && (
              <Divider variant="middle" />
            )}
          </Box>
        ))}
      </ContentCard>
      {id && (
        <AddressDialog
          shareholderId={id}
          open={addressDialogOpened}
          onClose={() => {
            setAddressDialogOpened(false);
            setSelectedAddress(undefined);
          }}
          onSubmit={onAddressAddOrUpdate}
          address={selectedAddress}
        />
      )}
    </>
  );
};
