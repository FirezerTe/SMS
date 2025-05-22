import { Avatar, Box } from "@mui/material";
import { useCallback } from "react";
import {
  ShareholderInfo,
  useAddShareholderPhotoMutation,
} from "../../../app/api";
import { DocumentUpload } from "../../../components";
import { usePermission } from "../../../hooks";
import { useAlert } from "../../notification";

export const ShareholderPhoto = ({
  shareholder,
}: {
  shareholder?: ShareholderInfo;
}) => {
  const [savePhoto] = useAddShareholderPhotoMutation();
  const { showErrorAlert, showSuccessAlert } = useAlert();
  const permissions = usePermission();

  const onProfilePictureAdd = useCallback(
    (files: any[]) => {
      if (shareholder?.id && files?.length) {
        savePhoto({
          id: shareholder.id,
          body: {
            file: files[0],
          },
        })
          .unwrap()
          .then(() => {
            showSuccessAlert("Photo uploaded");
          })
          .catch(() => {
            showErrorAlert("Error occurred");
          });
      }
    },
    [savePhoto, shareholder?.id, showErrorAlert, showSuccessAlert]
  );
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Avatar
          sx={{ width: 100, height: 100 }}
          src={shareholder?.photoUrl || undefined}
          alt={shareholder?.displayName || ""}
          variant="rounded"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <DocumentUpload
          onAdd={onProfilePictureAdd}
          label={`${(shareholder?.photoUrl && "Change") || "Add"} photo`}
          showIcon={false}
          size="small"
          accepts={["Image"]}
          disabled={!permissions.canCreateOrUpdateShareholderInfo}
        />
      </Box>
    </>
  );
};
