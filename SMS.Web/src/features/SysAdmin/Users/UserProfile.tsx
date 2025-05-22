import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicationRole, UserDetail } from "../../../app/api";
import { ActivateDeactivateUser } from "./ActivateDeactivateUserConfirmationDialog";

interface Props {
  userDetail: UserDetail;
  onRoleChange: (role: ApplicationRole, selected: boolean) => void;
  applicationRoles?: ApplicationRole[];
}
export const UserProfile = ({
  userDetail,
  applicationRoles = [],
  onRoleChange,
}: Props) => {
  const navigate = useNavigate();

  const handleRoleChange =
    (role: ApplicationRole) => (e: any, selected: boolean) => {
      onRoleChange(role, selected);
    };

  const onBackClick = useCallback(() => {
    navigate("/sys-admin/users");
  }, [navigate]);

  const { firstName, middleName, lastName, roles, isDeactivated } =
    userDetail || {};

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", py: 2 }}>
        <Button
          startIcon={<ChevronLeftIcon />}
          onClick={onBackClick}
          size="large"
        >
          All Users
        </Button>
      </Box>
      <Box
        sx={{
          flex: 1,
          p: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
          ...(isDeactivated
            ? {
                backgroundColor: "rgba(255, 99, 70, 0.2)",
              }
            : {}),
        }}
      >
        <Typography variant="h6">
          {`${firstName} ${middleName} ${lastName} ${
            (isDeactivated && "(DEACTIVATED)") || ""
          }`}
        </Typography>
        <ActivateDeactivateUser user={userDetail} />
      </Box>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5">Roles</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", pl: 2 }}>
          {applicationRoles.map((appRole) => (
            <FormControlLabel
              label={appRole.displayName}
              key={appRole.name}
              control={
                <Checkbox
                  checked={roles?.some((r) => r.name === appRole.name)}
                  onChange={handleRoleChange(appRole)}
                />
              }
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
