import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { uniq } from "lodash-es";
import { useCallback, useState } from "react";
import {
  FamilyDto,
  ShareholderBasicInfo,
  useAddFamilyMembersMutation,
  useGetShareholderByIdQuery,
  useRemoveFamilyMemberMutation,
} from "../../../../app/api";
import { ContentCard } from "../../../../components";
import { usePermission } from "../../../../hooks";
import { getDetailPageUrl } from "../../shareholdersGrids/useNavigateToDetailPage";
import { ShareholderRelativesDialog } from "./ShareholderRelativesDialog";

export const ShareholderRelatives = ({ id }: { id: number }) => {
  const { data: shareholderInfo } = useGetShareholderByIdQuery({
    id,
  });

  const [removeFamilyMember] = useRemoveFamilyMemberMutation();

  const [selectedFamily, setSelectedFamily] = useState<FamilyDto>();

  const [opened, setOpened] = useState(false);

  const [addFamilyMembers] = useAddFamilyMembersMutation();
  const permissions = usePermission();

  const onClose = useCallback(() => {
    setOpened(false);
  }, []);

  const onSubmit = useCallback(
    ({
      family,
      shareholders,
    }: {
      family?: FamilyDto;
      shareholders: ShareholderBasicInfo[];
    }) => {
      const members = uniq(
        (shareholders || [])
          .map(({ id }) => id)
          .filter((x) => x && x !== id) as number[]
      );
      members?.length &&
        addFamilyMembers({
          id,
          addFamilyMembersRequest: {
            members,
            familyId: family?.id,
          },
        });
      setOpened(false);
    },
    [addFamilyMembers, id]
  );

  const removeMember = useCallback(
    (family: FamilyDto, shareholder: ShareholderBasicInfo) => {
      shareholder?.id &&
        family?.id &&
        removeFamilyMember({
          id,
          removeFamilyMembersRequest: {
            shareholderId: shareholder.id,
            familyId: family.id,
          },
        });
    },
    [id, removeFamilyMember]
  );

  const familiesCount = (shareholderInfo?.families || []).length;

  return (
    <>
      <ContentCard>
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ my: 1, flex: 1 }}>Families</Typography>

          {permissions.canCreateOrUpdateShareholderInfo && !familiesCount && (
            <IconButton
              onClick={() => {
                setOpened(true);
              }}
              color="primary"
              title="Add"
              size="small"
              aria-label="add"
            >
              <AddIcon fontSize="inherit" />
            </IconButton>
          )}
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {(shareholderInfo?.families || [])?.map((family, index) => (
              <Grid container key={family.id}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="caption">
                      {`${family.name} Family`}
                    </Typography>
                    {!!permissions.canCreateOrUpdateShareholderInfo && (
                      <Button
                        onClick={() => {
                          setOpened(true);
                          setSelectedFamily(family);
                        }}
                        variant="text"
                        startIcon={<AddIcon />}
                        size="small"
                        color="success"
                      >
                        Member
                      </Button>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  {!family.members?.length ? (
                    <Grid item xs={12}>
                      <Typography sx={{ my: 1, flex: 1 }}>
                        No family members added
                      </Typography>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <List
                        dense
                        sx={{
                          width: "100%",
                          maxWidth: 360,
                          bgcolor: "background.paper",
                        }}
                      >
                        {family.members.map((member) => (
                          <ListItem
                            alignItems="flex-start"
                            key={member.id}
                            secondaryAction={
                              permissions.canCreateOrUpdateShareholderInfo ? (
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => removeMember(family, member)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              ) : undefined
                            }
                          >
                            <ListItemAvatar>
                              <Avatar
                                alt={member.displayName || ""}
                                src={member.photoUrl || undefined}
                              />
                            </ListItemAvatar>

                            <ListItemText
                              primary={member.displayName}
                              secondary={
                                <>
                                  <Box
                                    component="span"
                                    sx={{ display: "flex" }}
                                  >
                                    <Typography
                                      sx={{ display: "inline" }}
                                      component="span"
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {member.amharicDisplayName}
                                    </Typography>
                                  </Box>
                                  <Button
                                    href={getDetailPageUrl({
                                      id: member.id,
                                    })}
                                    target="_blank"
                                    component={Link}
                                    sx={{ textTransform: "capitalize" }}
                                    startIcon={<OpenInNewIcon />}
                                  >
                                    View Detail
                                  </Button>
                                </>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  )}
                </Grid>
                {familiesCount > 1 && index < familiesCount - 1 && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                )}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </ContentCard>
      {shareholderInfo && (
        <ShareholderRelativesDialog
          onClose={onClose}
          onSubmit={onSubmit}
          open={opened}
          shareholder={shareholderInfo}
          family={selectedFamily}
        />
      )}
    </>
  );
};
