import { Box, SxProps, Theme } from "@mui/material";
import { ContentCard } from "../../components";
import { SearchShareholder } from "../shareholder/SearchShareholder";

const style: SxProps<Theme> = {
  p: 2,
  m: 2,
  minWidth: 450,
  minHeight: 300,
};

export const Dashboard = () => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      <Box
        sx={{
          width: "100%",
          p: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SearchShareholder />
      </Box>
      <ContentCard
        title="Shareholders"
        elevation={1}
        divider={true}
        sx={style}
      ></ContentCard>
      <ContentCard
        title="Payments"
        elevation={1}
        divider={true}
        sx={style}
      ></ContentCard>
      <ContentCard
        title="Shareholders"
        elevation={1}
        divider={true}
        sx={style}
      ></ContentCard>
      <ContentCard
        title="Shareholders"
        elevation={1}
        divider={true}
        sx={style}
      ></ContentCard>
      <ContentCard
        title="Shareholders"
        elevation={1}
        divider={true}
        sx={style}
      ></ContentCard>
      <ContentCard
        title="Shareholders"
        elevation={1}
        divider={true}
        sx={style}
      ></ContentCard>
    </Box>
  );
};
