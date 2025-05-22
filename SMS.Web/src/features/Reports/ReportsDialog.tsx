import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useCallback, useRef, useState } from "react";
import { DialogHeader } from "../../components";
import { useAlert } from "../notification";
import { ReportDetail } from "./ReportDetail";
import { ReportType, reportsList } from "./utils";
interface Props {
  open: boolean;
  onClose: () => void;
}
export const ReportsDialog = ({ open, onClose }: Props) => {
  const [reportDataReady, setReportDataReady] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportType>(
    reportsList[0].type
  );
  const [isFetching, setIsFetching] = useState(false);
  const ref = useRef<{
    submit: () => void;
  }>();

  const { showErrorAlert } = useAlert();

  const closeDialog = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedReport(event.target.value as ReportType);
  };

  const onError = useCallback(
    (_: any) => {
      showErrorAlert("Error occurred");
      setIsFetching(false);
    },
    [showErrorAlert]
  );

  const onDownloadStart = useCallback(() => {
    setIsFetching(true);
  }, []);

  const report = reportsList.find((r) => r.type === selectedReport);

  return (
    <>
      {!!open && (
        <Dialog
          scroll={"paper"}
          disableEscapeKeyDown={true}
          maxWidth={"md"}
          open={open}
        >
          <DialogHeader title={"Reports"} onClose={onClose} />
          <DialogContent dividers={true} sx={{ width: 600 }}>
            <Box sx={{ display: "flex" }}>
              <FormControl sx={{ flex: 1 }} size="small" disabled={isFetching}>
                <InputLabel id="select-report-label">Select Report</InputLabel>
                <Select
                  labelId="select-report-label"
                  id="select-report"
                  value={selectedReport}
                  label="Select Report"
                  onChange={handleChange}
                >
                  {reportsList.map((report) => (
                    <MenuItem key={report.type} value={report.type}>
                      {report.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Divider sx={{ mt: 2, mb: 3 }} />
            <Box sx={{ my: 2 }}>
              {report && (
                <Box sx={{ my: 2, display: "flex", flexDirection: "row" }}>
                  <Typography variant="subtitle1">Report:</Typography>
                  <Typography sx={{ ml: 1 }}>{report.name}</Typography>
                </Box>
              )}
              <Typography sx={{ my: 2 }} variant="subtitle1">
                Report Parameters
              </Typography>
              <ReportDetail
                report={selectedReport}
                ref={ref as any}
                onReportParamsValidation={setReportDataReady}
                onDownloadComplete={closeDialog}
                onError={onError}
                onDownloadStart={onDownloadStart}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button
              startIcon={
                isFetching ? <CircularProgress size={16} /> : undefined
              }
              color="primary"
              variant="outlined"
              type="submit"
              disabled={!reportDataReady || isFetching}
              onClick={() => ref?.current?.submit?.()}
            >
              Generate Report
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
