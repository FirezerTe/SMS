import { StyleSheet } from "@react-pdf/renderer";

export const commonStyles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingHorizontal: 35,
    paddingTop: 35,
    paddingBottom: 50,
  },
  section: {
    paddingTop: 4,
    paddingBottom: 4,
    flexGrow: 1,
    display: "flex",
    flexWrap: "wrap",
  },
});
