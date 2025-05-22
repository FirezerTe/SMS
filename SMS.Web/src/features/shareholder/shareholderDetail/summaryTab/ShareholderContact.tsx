import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  ContactDto,
  useAddShareholderContactMutation,
  useGetShareholderContactsQuery,
  useUpdateShareholderContactMutation,
} from "../../../../app/api";
import { ShareholderChangeLogEntityType } from "../../../../app/api/enums";
import { ContentCard, KeyValuePair } from "../../../../components";
import { usePermission } from "../../../../hooks";
import { getChangelogStyle } from "../../../../utils";
import { ContactTypeLookup } from "../../../common";
import { useCurrentVersion } from "../../useCurrentVersion";
import { useShareholderChangeLogs } from "../shareholderChangeLog";
import { ContactDialog } from "./ContactDialog";

export const ShareholderContact = ({
  id,
  version,
}: {
  id: number;
  version?: string;
}) => {
  const { data: contacts } = useGetShareholderContactsQuery(
    {
      id,
      version,
    },
    {
      skip: !id,
    }
  );

  const { loadCurrentVersion } = useCurrentVersion();

  const [addContact, addContactResponse] = useAddShareholderContactMutation();
  const [updateContact, updateContactResponse] =
    useUpdateShareholderContactMutation();
  const permissions = usePermission();

  const [contactDialogOpened, setContactDialogOpened] = useState(false);
  const [selectedContact, setSelectedContact] = useState<
    ContactDto | undefined
  >();

  useEffect(() => {
    if (addContactResponse.isSuccess || updateContactResponse.isSuccess) {
      setSelectedContact(undefined);
      setContactDialogOpened(false);
      addContactResponse.reset();
      updateContactResponse.reset();
      loadCurrentVersion();
    }
  }, [addContactResponse, loadCurrentVersion, updateContactResponse]);

  const onContactAddOrUpdate = useCallback(
    async (contactDto: ContactDto) => {
      selectedContact
        ? updateContact({
            id,
            contactDto,
          })
        : addContact({
            id,
            contactDto,
          });
    },
    [addContact, id, selectedContact, updateContact]
  );

  const { changeLogs } = useShareholderChangeLogs();

  const getChangeLog = useCallback(
    (address: ContactDto) =>
      changeLogs?.find(
        (c) =>
          c.entityType === ShareholderChangeLogEntityType.Contact &&
          c.entityId === address.id
      ),
    [changeLogs]
  );

  return (
    <>
      <ContentCard>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography sx={{ my: 1 }}>Contact</Typography>
          <Button
            onClick={() => {
              setSelectedContact(undefined);
              setContactDialogOpened(true);
            }}
            variant="text"
            startIcon={<AddIcon />}
            size="small"
            color="success"
            disabled={!permissions.canCreateOrUpdateShareholderInfo}
          >
            New Contact
          </Button>
        </Box>
        {(contacts || []).map((c) => {
          const label = (c?.type && ContactTypeLookup[c.type]) || "";
          return (
            <Box
              key={`contact-${c?.type || ""}-${c?.value || ""}-${c.id}`}
              sx={getChangelogStyle(getChangeLog(c))}
            >
              <KeyValuePair label={label} value={c.value!}>
                {permissions.canCreateOrUpdateShareholderInfo && (
                  <IconButton
                    color="primary"
                    title={`${label}:${c?.value || ""}`}
                    size="small"
                    aria-label="edit"
                    onClick={() => {
                      setSelectedContact(c);
                      setContactDialogOpened(true);
                    }}
                  >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                )}
              </KeyValuePair>
            </Box>
          );
        })}
      </ContentCard>
      {id && (
        <ContactDialog
          shareholderId={id}
          open={contactDialogOpened}
          onClose={() => {
            setContactDialogOpened(false);
            setSelectedContact(undefined);
          }}
          onSubmit={onContactAddOrUpdate}
          contact={selectedContact}
        />
      )}
    </>
  );
};
