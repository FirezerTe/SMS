import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { ShareholderDocumentDto } from "../../../app/api";
import { DocumentDownload } from "../../../components";

export const DocumentsList = ({
  documents,
  title,
}: {
  documents: ShareholderDocumentDto[];
  title: string;
}) => {
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", px: 1 }}>
        {(documents || []).map((d) => (
          <Box key={d.documentId}>
            <DocumentDownload
              documentId={d.documentId!}
              label={d.fileName || "document"}
              size="large"
            />
            <Typography variant="caption">{`(Uploaded at ${
              d.createdAt && dayjs(d.createdAt).format("lll")
            })`}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
