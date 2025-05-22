import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Fragment, useState } from "react";
import { AllocationDto } from "../../app/api";

import { Box, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import { ApprovalStatus } from "../../app/api/enums";
import { FormattedText } from "../../components";
import { usePermission } from "../../hooks";
import { formatNumber } from "../common";
import { AllocationDialog } from "./AllocationDialog";
import { ApproveOrRejectRequestButton } from "./ApproveOrRejectRequestButton";
import { RequestApprovalButton } from "./RequestApprovalButton";

export const AllocationList = ({
  hideWorkflowComment,
  allocations = [],
}: {
  hideWorkflowComment?: boolean;
  allocations?: AllocationDto[];
}) => {
  const [selectedAllocation, setSelectedAllocation] = useState<AllocationDto>();

  const permissions = usePermission();

  const showComment = (allocation: AllocationDto) =>
    allocations.length > 0 &&
    !hideWorkflowComment &&
    allocation.workflowComment;

  return (
    <>
      <Box>
        <Paper>
          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>From Date</TableCell>
                  <TableCell>To Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(allocations || []).map((item) => (
                  <Fragment key={item.id}>
                    <TableRow
                      hover={false}
                      key={`${item.id}-allocation`}
                      sx={
                        !hideWorkflowComment
                          ? {
                              cursor: "pointer",
                              "& > *": { borderBottom: 0 },
                            }
                          : {}
                      }
                    >
                      <TableCell
                        sx={{
                          borderBottomWidth: showComment(item) ? 0 : undefined,
                        }}
                        component="th"
                        scope="row"
                      >
                        <Typography variant="body2">
                          {item.name}{" "}
                          {!!item.isOnlyForExistingShareholders && (
                            <Typography
                              component={"span"}
                              variant="caption"
                              color="info.main"
                            >
                              {" "}
                              (Only for Existing Shareholders)
                            </Typography>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomWidth: showComment(item) ? 0 : undefined,
                        }}
                        component="th"
                        scope="row"
                      >
                        {formatNumber(item.amount, 2)}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomWidth: showComment(item) ? 0 : undefined,
                        }}
                        component="th"
                        scope="row"
                      >
                        {(item.fromDate &&
                          dayjs(item.fromDate).format("MMMM D, YYYY")) ||
                          ""}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomWidth: showComment(item) ? 0 : undefined,
                        }}
                        component="th"
                        scope="row"
                      >
                        {(item.toDate &&
                          dayjs(item.toDate).format("MMMM D, YYYY")) ||
                          ""}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottomWidth: showComment(item) ? 0 : undefined,
                        }}
                        component="th"
                        scope="row"
                      >
                        {item.description}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          borderBottomWidth: showComment(item) ? 0 : undefined,
                          width: 300,
                          verticalAlign: "top",
                        }}
                      >
                        {!item.isDividendAllocation && (
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
                            {!!item.isLatestRecord && (
                              <Button
                                size="small"
                                onClick={() => setSelectedAllocation(item)}
                                disabled={
                                  !permissions.canCreateOrUpdateAllocation
                                }
                              >
                                Edit
                              </Button>
                            )}
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                    {showComment(item) && (
                      <TableRow key={`${item.id}-comment`}>
                        <TableCell colSpan={8}>
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
        </Paper>
        {selectedAllocation && (
          <AllocationDialog
            allocation={selectedAllocation}
            onClose={() => {
              setSelectedAllocation(undefined);
            }}
            title="Edit Allocation"
          />
        )}
      </Box>
      {/* <Paper>
        <TableContainer>
          <Table
            sx={{ minWidth: 400 }}
            size="medium"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Allocation Name</TableCell>
                <TableCell>Allocation Amount</TableCell>
                <TableCell>Allocation Status</TableCell>
                <TableCell>Allocation Date</TableCell>
                <TableCell>Allocation Description</TableCell>
                <TableCell>FromDate</TableCell>
                <TableCell>ToDate</TableCell>
                <TableCell>Individual Allocation Period</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(allocations || []).map(
                ({
                  id,
                  name,
                  amount,
                  allocationStatus,
                  allocationDate,
                  description,
                  fromDate,
                  toDate,
                  individualAllocationPeriod,
                }) => (
                  <TableRow
                    hover={true}
                    key={id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                    onClick={handleRowClick(id)}
                  >
                    <TableCell component="th" scope="row">
                      {id}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {amount}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {getStatusLabel(allocationStatus)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {allocationDate}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {description}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {fromDate}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {toDate}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {individualAllocationPeriod}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper> */}
    </>
  );
};
