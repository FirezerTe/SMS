import { View } from "@react-pdf/renderer";

export const Divider = () => (
  <View
    style={{
      borderBottomStyle: "solid",
      borderBottomWidth: 0.5,
      marginTop: 2,
      marginBottom: 2,
      borderColor: "gray",
    }}
  ></View>
);
