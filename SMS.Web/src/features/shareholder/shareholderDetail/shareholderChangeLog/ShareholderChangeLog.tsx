import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { modifiedStyle } from "../../../../utils";

export const ShareholderChangeLog = ({
  changeLabels,
}: {
  changeLabels: string[];
}) => {
  return (
    <Box sx={modifiedStyle}>
      <Accordion defaultExpanded square={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" color={"info.dark"}>
            Change Log
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <Box sx={{ px: 5 }}>
            <List sx={{ listStyleType: "disc", color: "info.dark" }}>
              {changeLabels.map((c) => (
                <ListItem key={c} sx={{ display: "list-item", py: 0.2, px: 0 }}>
                  <Typography variant="body1">{c}.</Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
