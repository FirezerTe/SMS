import ReactPDF, { Document, Font, StyleSheet } from "@react-pdf/renderer";
import path from "path";

Font.register({
  family: "OpenSans",

  fonts: [
    {
      src: path.join(__dirname, `../assets/fonts/OpenSans-Regular.ttf`),
    },
    {
      fontWeight: "bold",
      src: path.join(__dirname, `../assets/fonts/OpenSans-Bold.ttf`),
    },
    {
      fontWeight: "light",
      src: path.join(__dirname, `../assets/fonts/OpenSans-Light.ttf`),
    },
    {
      fontWeight: "normal",
      fontStyle: "italic",
      src: path.join(__dirname, `../assets/fonts/OpenSans-Italic.ttf`),
    },
    {
      fontWeight: "bold",
      fontStyle: "italic",
      src: path.join(__dirname, `../assets/fonts/OpenSans-BoldItalic.ttf`),
    },
  ],
});

Font.register({
  family: "Roboto",

  fonts: [
    {
      src: path.join(__dirname, `../assets/fonts/Roboto-Regular.ttf`),
    },
    {
      fontWeight: "bold",
      src: path.join(__dirname, `../assets/fonts/Roboto-Bold.ttf`),
    },
    {
      fontWeight: "light",
      src: path.join(__dirname, `../assets/fonts/Roboto-Light.ttf`),
    },
    {
      fontWeight: "semibold",
      src: path.join(__dirname, `../assets/fonts/Roboto-Medium.ttf`),
    },
    {
      fontWeight: "normal",
      fontStyle: "italic",
      src: path.join(__dirname, `../assets/fonts/Roboto-Italic.ttf`),
    },
    {
      fontWeight: "bold",
      fontStyle: "italic",
      src: path.join(__dirname, `../assets/fonts/Roboto-BoldItalic.ttf`),
    },
  ],
});

Font.register({
  family: "Amharic",

  fonts: [
    {
      src: path.join(
        __dirname,
        `../assets/fonts/NotoSerifEthiopic-Regular.ttf`
      ),
    },
    {
      fontWeight: "bold",
      src: path.join(__dirname, `../assets/fonts/NotoSerifEthiopic-Bold.ttf`),
    },
    {
      fontWeight: "normal",
      fontStyle: "italic",
      src: path.join(__dirname, `../assets/fonts/NotoSerifEthiopic-Italic.ttf`),
    },
    {
      fontWeight: "bold",
      fontStyle: "italic",
      src: path.join(
        __dirname,
        `../assets/fonts/NotoSerifEthiopic-BoldItalic.ttf`
      ),
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

interface Props {
  report: JSX.Element;
}
const PDF = ({ report }: Props) => (
  <Document style={{ fontFamily: "OpenSans", fontSize: 14, lineHeight: 1.4 }}>
    {report}
  </Document>
);

export const createPDF = async (report: JSX.Element) => {
  return await ReactPDF.renderToStream(<PDF report={report} />);
};
