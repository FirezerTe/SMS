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
import { BankAllocationDto } from "../../app/api";
import { ApprovalStatus } from "../../app/api/enums";
import { FormattedText } from "../../components";
import { usePermission } from "../../hooks";
import { formatNumber } from "../common";
import { ApproveOrRejectRequestButton } from "./ApproveOrRejectRequestButton";
import { BankAllocationDialog } from "./BankAllocationDialog";
import { RequestApprovalButton } from "./RequestApprovalButton";

interface BankAllocationListProps {
  items?: BankAllocationDto[];
  hideWorkflowComment?: boolean;
  suppressActionColumn?: boolean;
}

export const BankAllocationList = ({
  items = [],
  hideWorkflowComment,
  suppressActionColumn,
}: BankAllocationListProps) => {
  const [selectedBankAllocation, setSelectedBankAllocation] =
    useState<BankAllocationDto>();

  const { canCreateOrUpdateBankAllocation } = usePermission();

  return (
    <Box>
      <Paper>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Max Purchase Limit</TableCell>
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
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {formatNumber(item.amount)}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top", width: 200 }}>
                      {`${item.maxPercentagePurchaseLimit || ""}`}{" "}
                      {`${(item.maxPercentagePurchaseLimit && "%") || ""}`}
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
                              {item.approvalStatus === ApprovalStatus.Draft && (
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
                            onClick={() => setSelectedBankAllocation(item)}
                            disabled={!canCreateOrUpdateBankAllocation}
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
                        <TableCell colSpan={6}>
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
      {selectedBankAllocation && (
        <BankAllocationDialog
          bankAllocation={selectedBankAllocation}
          onClose={() => {
            setSelectedBankAllocation(undefined);
          }}
          title="Edit Bank Allocation"
        />
      )}
    </Box>
  );
};
