import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import { ParValueDto } from "../../app/api";
import { ApprovalStatus } from "../../app/api/enums";
import { FormattedText } from "../../components";
import { usePermission } from "../../hooks";
import { ApproveOrRejectRequestButton } from "./ApproveOrRejectRequestButton";
import { ParValueDialog } from "./ParValueDialog";
import { RequestApprovalButton } from "./RequestApprovalButton";

interface ParValueListProps {
  items?: ParValueDto[];
  hideWorkflowComment?: boolean;
  suppressActionColumn?: boolean;
}

export const ParValuesList = ({
  items = [],
  hideWorkflowComment,
  suppressActionColumn,
}: ParValueListProps) => {
  const [selectedParValue, setSelectedParValue] = useState<ParValueDto>();

  const permissions = usePermission();

  return (
    <Box>
      <Paper>
        <Box sx={{ maxWidth: "100%" }}>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Description</TableCell>
                  {!suppressActionColumn && (
                    <TableCell align="center">Actions</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {(items || []).map((item) => (
                  <Fragment key={item.id}>
                    <TableRow
                      hover={false}
                      key={item.id}
                      sx={
                        !hideWorkflowComment
                          ? {
                              cursor: "pointer",
                              "& > *": { borderBottom: "unset" },
                            }
                          : {}
                      }
                    >
                      <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                        {item.name}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top", width: 100 }}>
                        {item.amount}
                      </TableCell>
                      <TableCell
                        sx={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          verticalAlign: "top",
                        }}
                      >
                        <Box>
                          <FormattedText text={item.description} />
                        </Box>
                      </TableCell>
                      {!suppressActionColumn && (
                        <TableCell
                          align="right"
                          sx={{ width: 280, verticalAlign: "top" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            {item.id && (
                              <>
                                {item.approvalStatus ===
                                  ApprovalStatus.Draft && (
                                  <RequestApprovalButton id={item.id} />
                                )}
                                {item.approvalStatus ===
                                  ApprovalStatus.Submitted && (
                                  <ApproveOrRejectRequestButton id={item.id} />
                                )}
                              </>
                            )}
                            <Button
                              size="small"
                              onClick={() => setSelectedParValue(item)}
                              disabled={!permissions.canCreateOrUpdateParValue}
                            >
                              Edit
                            </Button>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                    {items.length > 0 &&
                      !hideWorkflowComment &&
                      item.workflowComment && (
                        <TableRow>
                          <TableCell colSpan={1}>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Typography
                                sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                Comment:
                              </Typography>
                              <FormattedText text={item.workflowComment} />
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
      {selectedParValue && (
        <ParValueDialog
          parValue={selectedParValue}
          onClose={() => {
            setSelectedParValue(undefined);
          }}
          title="Edit Par Value"
        />
      )}
    </Box>
  );
};
