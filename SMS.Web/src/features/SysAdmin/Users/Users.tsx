import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserDetail, useUsersQuery } from "../../../app/api";
import { UsersList } from "./UsersList";

export const Users = () => {
  const navigate = useNavigate();
  const { data: users } = useUsersQuery();

  const onUserSelect = useCallback(
    (user: UserDetail) => {
      navigate(`/sys-admin/users/${user.id}`);
    },
    [navigate]
  );
  return (
    <Box>
      <Box sx={{ display: "flex", my: 2 }}>
        <Box sx={{ flex: 1 }}></Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => {
              navigate("/sys-admin/new-user");
            }}
          >
            Add New User
          </Button>
        </Box>
      </Box>
      <UsersList users={users || []} onSelect={onUserSelect} />
    </Box>
  );
};
