import {
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { ApprovalStatus } from "../../../api-client/api-client";
import {
  useGetAllShareholdersQuery,
  useGetShareholderCountPerApprovalStatusQuery,
} from "../../../app/store";
import { Pagination } from "../../../components";
import { getGenderLabel } from "../../../utils";
import { useCountries } from "../../countries";
import { useShareholderStatus } from "../useShareholderStatus";
import { useNavigateToDetailPage } from "./useNavigateToDetailPage";

export const DraftShareholders = () => {
  const { navigateToDetailPage } = useNavigateToDetailPage();
  const [pagination, setPagination] = useState<{
    pageNumber: number;
    pageSize?: number;
  }>({
    pageNumber: 0,
    pageSize: 10,
  });

  const { getCountryById } = useCountries();
  const { data: counts, isLoading: isCountsLoading } =
    useGetShareholderCountPerApprovalStatusQuery();
  const { getStatus } = useShareholderStatus();

  const { data, isLoading: isListLoading } = useGetAllShareholdersQuery({
    pageNumber: pagination.pageNumber + 1,
    pageSize: pagination.pageSize,
    status: ApprovalStatus.Draft,
  });

  const isLoading = isCountsLoading || isListLoading;

  return (
    <>
      {!isLoading && !!counts?.drafts && (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 400 }} size="medium">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Amharic Name</TableCell>
                  <TableCell>Citizenship</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>File Number</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Tin Number</TableCell>
                  <TableCell>Gender</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data?.items || []).map(
                  ({
                    id,
                    displayName,
                    amharicDisplayName,
                    countryOfCitizenship,
                    type,
                    fileNumber,
                    shareholderStatus,
                    tinNumber,
                    gender,
                    photoUrl,
                    versionNumber,
                  }) => (
                    <TableRow
                      hover={true}
                      key={id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        cursor: "pointer",
                      }}
                      onClick={navigateToDetailPage({
                        id,
                        versionNumber,
                      })}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        style={{
                          width: 40,
                        }}
                        align="center"
                      >
                        <Avatar
                          sx={{ width: "32px", height: "32px" }}
                          alt={displayName || ""}
                          src={photoUrl || undefined}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {displayName}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {amharicDisplayName}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {(countryOfCitizenship &&
                          getCountryById(countryOfCitizenship)?.nationality) ||
                          ""}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {type?.displayName || ""}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {fileNumber}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {getStatus(shareholderStatus)?.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {tinNumber}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {getGenderLabel(gender)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            pageNumber={pagination.pageNumber}
            pageSize={pagination.pageSize}
            onChange={setPagination}
            totalRowsCount={counts?.drafts}
            rowsPerPageOptions={[10, 20, 50]}
          />
        </>
      )}
      {isLoading && (
        <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {!isLoading && !counts?.drafts && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Typography>No data available</Typography>
        </Box>
      )}
    </>
  );
};
