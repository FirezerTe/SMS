import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback } from "react";
import { UserDetail } from "../../../app/api";
import { ActivateDeactivateUser } from "./ActivateDeactivateUserConfirmationDialog";

interface Props {
  users: UserDetail[];
  onSelect: (user: UserDetail) => void;
}
export const UsersList = ({ users, onSelect }: Props) => {
  const onUserSelect = useCallback(
    (user: UserDetail) => () => {
      onSelect(user);
    },
    [onSelect]
  );
  return (
    <TableContainer>
      <Table sx={{ minWidth: 400 }} size="medium" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>UserName / Email</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Roles</TableCell>
            <TableCell>Claims</TableCell>
            <TableCell>#Access Failed</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(users || []).map((user) => {
            const {
              id,
              email,
              accessFailedCount,
              firstName,
              middleName,
              lastName,
              roles = [],
              claims = [],
              isDeactivated,
            } = user;
            return (
              <TableRow
                hover={true}
                key={id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  ...(isDeactivated
                    ? {
                        backgroundColor: "rgba(255, 99, 70, 0.3)",
                        "&.MuiTableRow-root:hover": {
                          backgroundColor: "rgba(255, 99, 70, 0.2)",
                        },
                      }
                    : {}),
                }}
              >
                <TableCell component="th" scope="row">
                  {`${email}${(isDeactivated && " (DEACTIVATED)") || ""}`}
                </TableCell>
                <TableCell component="th" scope="row">
                  {`${firstName} ${middleName} ${lastName}`}
                </TableCell>
                <TableCell component="th" scope="row">
                  {(roles || []).map((r) => (
                    <Box key={r.name}>
                      <Typography variant="body2">
                        &#8226; {r.displayName}
                      </Typography>
                    </Box>
                  ))}
                </TableCell>
                <TableCell component="th" scope="row">
                  {(claims || []).map((c) => (
                    <Box sx={{ display: "flex" }} key={c.claimType}>
                      <Typography variant="body2">
                        &#8226; {c.claimType}
                        {c.claimValue ? ` = ${c.claimValue}` : ""}
                      </Typography>
                    </Box>
                  ))}
                </TableCell>
                <TableCell component="th" scope="row">
                  {accessFailedCount}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                  >
                    <Button onClick={onUserSelect(user)}>View Profile</Button>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ActivateDeactivateUser user={user} />
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
