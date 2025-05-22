import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { uniqBy } from "lodash-es";
import { useCallback, useEffect, useState } from "react";
import {
  FamilyDto,
  ShareholderBasicInfo,
  useGetFamiliesMutation,
} from "../../../../app/api";
import { DialogHeader } from "../../../../components";
import { usePermission } from "../../../../hooks";
import { ShareholderTypeaheadSearch } from "../../ShareholderTypeaheadSearch";

interface Props {
  shareholder: ShareholderBasicInfo;
  family?: FamilyDto;
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    family?: FamilyDto;
    shareholders: ShareholderBasicInfo[];
  }) => void;
}
export const ShareholderRelativesDialog = ({
  shareholder,
  open,
  family,
  onSubmit,
  onClose,
}: Props) => {
  const [selectedMembers, setSelectedMembers] = useState<
    ShareholderBasicInfo[]
  >([]);
  const permissions = usePermission();

  const [existingFamilies, setExistingFamilies] = useState<FamilyDto[]>([]);

  const [fetchFamilies, { data, isUninitialized, isLoading, reset }] =
    useGetFamiliesMutation();

  useEffect(() => {
    selectedMembers?.length &&
      fetchFamilies({
        id: shareholder.id || 0,
        getFamiliesRequest: {
          shareholderIds: (selectedMembers || []).map(
            ({ id }) => id
          ) as number[],
        },
      });
  }, [fetchFamilies, selectedMembers, shareholder.id]);

  useEffect(() => {
    const x = uniqBy<FamilyDto>(
      [family, ...(data && !isLoading && !isUninitialized ? data! : [])].filter(
        (x) => x
      ) as FamilyDto[],
      "id"
    );

    setExistingFamilies(x);
  }, [data, family, isLoading, isUninitialized]);

  useEffect(() => {
    !open && reset();
  }, [open, reset]);

  const handleSubmit = useCallback(
    async (family?: FamilyDto) => {
      selectedMembers?.length &&
        onSubmit({ family, shareholders: selectedMembers });
    },
    [onSubmit, selectedMembers]
  );

  const onShareholderSelect = useCallback(
    (selected: ShareholderBasicInfo[]) => {
      setSelectedMembers(selected);
    },
    []
  );

  const onDialogClose = useCallback(() => {
    setSelectedMembers([]);
    onClose();
  }, [onClose]);

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
      <DialogHeader title={"Relatives"} onClose={onClose} />
      <DialogContent dividers={true} sx={{ width: 600 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <ShareholderTypeaheadSearch
                onMultiSelect={onShareholderSelect}
                fullWidth={true}
                multiSelect={true}
                exclude={shareholder?.id ? [shareholder.id] : undefined}
              />
            </Box>
          </Grid>
        </Grid>
        {!existingFamilies.length && !!selectedMembers?.length && (
          <Typography>Click Add to create a new family.</Typography>
        )}
        {!!existingFamilies.length && (
          <Grid container>
            <Grid item xs={12}>
              <List dense>
                <ListItem>
                  <Typography
                    component="span"
                    color="text.primary"
                    variant="caption"
                  >
                    - Click [Add to this family] to add the current and selected
                    shareholder(s) to an existing family.
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography
                    component="span"
                    color="text.primary"
                    variant="caption"
                  >
                    - Click [Add] to create a new family
                  </Typography>
                </ListItem>
              </List>

              <List dense sx={{ width: "100%" }}>
                {existingFamilies.map((f) => (
                  <Box key={f.id}>
                    <ListItem
                      secondaryAction={
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleSubmit(f)}
                          disabled={[
                            shareholder?.id,
                            ...(selectedMembers || []).map(({ id }) => id),
                          ].every((id) => f.members?.some((m) => m.id === id))}
                        >
                          Add to this family
                        </Button>
                      }
                    >
                      <ListItemText
                        primary={
                          <>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              color="text.primary"
                            >
                              {f.name}
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Box sx={{ display: "flex" }}>
                              <Typography
                                sx={{
                                  display: "inline",
                                  mr: 1,
                                }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                Members -
                              </Typography>
                              {(f.members || []).map((m, index) => (
                                <>
                                  {[
                                    shareholder?.id,
                                    ...(selectedMembers || []).map(
                                      ({ id }) => id
                                    ),
                                  ].some((id) => id === m.id) ? (
                                    <Box
                                      sx={{
                                        fontStyle: "italic",
                                        textDecoration: "underline",
                                      }}
                                    >
                                      {m.displayName}
                                    </Box>
                                  ) : (
                                    m.displayName
                                  )}
                                  {index < (f.members || []).length - 1 && (
                                    <Typography sx={{ mr: 1 }}>,</Typography>
                                  )}
                                </>
                              ))}
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider sx={{ width: "100%" }} />
                  </Box>
                ))}
              </List>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onDialogClose}>Cancel</Button>
        <Button
          color="primary"
          variant="outlined"
          type="submit"
          disabled={
            !permissions.canCreateOrUpdateShareholderInfo ||
            !selectedMembers?.length
          }
          onClick={() => handleSubmit()}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
