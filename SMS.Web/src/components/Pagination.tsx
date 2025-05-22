import { Divider, TablePagination } from "@mui/material";

interface PaginationProps {
  onChange: (args: { pageNumber: number; pageSize: number }) => void;
  pageNumber: number;
  pageSize?: number;
  rowsPerPageOptions?: number[];
  totalRowsCount?: number;
  hideDivider?: boolean;
}
export const Pagination = ({
  pageNumber,
  pageSize = 10,
  totalRowsCount,
  rowsPerPageOptions = [10, 20, 50],
  onChange,
  hideDivider,
}: PaginationProps) => {
  return (
    <>
      {!!totalRowsCount && (
        <>
          {!hideDivider && <Divider />}
          {totalRowsCount && pageNumber >= 0 && pageSize && (
            <TablePagination
              component="div"
              showFirstButton={true}
              showLastButton={true}
              rowsPerPageOptions={rowsPerPageOptions}
              onPageChange={(_, pageNumber) => {
                onChange({ pageSize, pageNumber });
              }}
              page={pageNumber}
              count={totalRowsCount}
              rowsPerPage={pageSize}
              onRowsPerPageChange={(event) => {
                onChange({
                  pageNumber: 0,
                  pageSize: parseInt(event.target.value),
                });
              }}
            />
          )}
        </>
      )}
    </>
  );
};
