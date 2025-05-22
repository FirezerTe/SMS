import { Box, Paper } from "@mui/material";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useShareholderIdAndVersion } from "../useShareholderIdAndVersion";
import { Representative } from "./Representative";
import { ShareholderAddress } from "./ShareholderAddress";
import { ShareholderInfo } from "./ShareholderBasicInfo";
import { ShareholderContact } from "./ShareholderContact";
import { ShareholderRelatives } from "./ShareholderRelatives";

export const SummaryTab = () => {
  const params = useParams();
  const shareholderId = useMemo(() => +(params?.id || 0), [params?.id]);
  const { version } = useShareholderIdAndVersion();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 3,
      }}
    >
      {!!shareholderId && (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 3,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 1,
                padding: 2,
              }}
            >
              <ShareholderInfo id={shareholderId} version={version} />
            </Paper>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 1,
                padding: 2,
              }}
            >
              <ShareholderAddress id={shareholderId} />
            </Paper>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 3,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 1,
                padding: 2,
              }}
            >
              <ShareholderContact id={shareholderId} version={version} />
            </Paper>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 1,
                padding: 2,
              }}
            >
              <Representative shareholderId={shareholderId} version={version} />
            </Paper>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 1,
                padding: 2,
              }}
            >
              <ShareholderRelatives id={shareholderId} />
            </Paper>
          </Box>
        </>
      )}
    </Box>
  );
};
