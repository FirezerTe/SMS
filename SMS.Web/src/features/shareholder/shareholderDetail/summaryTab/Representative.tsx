import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useGetShareholderInfoQuery } from "../../../../app/api";
import { ContentCard, KeyValuePair } from "../../../../components";
import { usePermission } from "../../../../hooks";
import { useCountries } from "../../../countries";
import { RepresentativeDialog } from "./RepresentativeDialog";

export const Representative = ({
  shareholderId,
  version,
}: {
  shareholderId: number;
  version?: string;
}) => {
  const { data: shareholderInfo } = useGetShareholderInfoQuery(
    {
      id: shareholderId,
      version,
    },
    {
      skip: !shareholderId,
    }
  );
  const [dialogOpened, setDialogOpened] = useState(false);
  const { getCountryById } = useCountries();
  const permission = usePermission();

  const {
    representativeName,
    representativeEmail,
    representativePhoneNumber,
    representativeAddress,
  } = shareholderInfo || {};

  const { city, countryId, houseNumber, kebele, woreda, subCity } =
    representativeAddress || {};

  const hasRepresentative =
    representativeName ||
    representativeEmail ||
    representativePhoneNumber ||
    representativeAddress;

  return (
    <>
      <ContentCard>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography sx={{ my: 1 }}>Representative</Typography>
          {permission.canCreateOrUpdateShareholderInfo && (
            <Button
              onClick={() => {
                setDialogOpened(true);
              }}
              variant="text"
              startIcon={!hasRepresentative ? <AddIcon /> : <EditIcon />}
              size="small"
              color="success"
            >
              {`${(hasRepresentative && "Edit") || "Add"} Representative`}
            </Button>
          )}
        </Box>
        {!!hasRepresentative && (
          <Box>
            <KeyValuePair label="Name" value={representativeName} />
            <KeyValuePair
              label="Phone Number"
              value={representativePhoneNumber}
            />
            <KeyValuePair label="Email" value={representativeEmail} />
            <KeyValuePair label="Address" />
            <Box sx={{ pl: 2 }}>
              {representativeAddress?.countryId && (
                <KeyValuePair
                  label="Country"
                  value={
                    getCountryById(representativeAddress?.countryId)?.name || ""
                  }
                />
              )}
              <KeyValuePair label="City" value={representativeAddress?.city} />
              <KeyValuePair
                label="Sub-City"
                value={representativeAddress?.subCity}
              />
              <KeyValuePair
                label="Kebele"
                value={representativeAddress?.kebele}
              />
              <KeyValuePair
                label="Woreda"
                value={representativeAddress?.woreda}
              />
              <KeyValuePair
                label="House Number"
                value={representativeAddress?.houseNumber}
              />
            </Box>
          </Box>
        )}
      </ContentCard>
      {dialogOpened && shareholderInfo?.id && (
        <RepresentativeDialog
          shareholderId={shareholderInfo.id}
          onClose={() => {
            setDialogOpened(false);
          }}
          open={dialogOpened}
          representativeInfo={{
            name: representativeName || undefined,
            email: representativeEmail || undefined,
            phoneNumber: representativePhoneNumber || undefined,
            city: city || undefined,
            countryId: countryId || undefined,
            houseNumber: houseNumber || undefined,
            kebele: kebele || undefined,
            woreda: woreda || undefined,
            subCity: subCity || undefined,
          }}
        />
      )}
    </>
  );
};
