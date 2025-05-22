import { Text, View } from "@react-pdf/renderer";
import { Divider } from "./Divider";
import { Logo } from "./Logo";

export const Footer = () => (
  <View
    fixed
    style={{
      position: "absolute",
      fontSize: 10,
      bottom: 0,
      left: 0,
      right: 0,
      display: "flex",
      flexDirection: "column",
      paddingHorizontal: 35,
      paddingVertical: 10,
    }}
  >
    <Divider />
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        position: "relative",
        height: "30",
      }}
    >
      <Text style={{ flex: 1 }}>Share Management System</Text>

      <Text
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
        fixed
      />
      <View
        style={{
          position: "absolute",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Logo />
      </View>
      <Text
        wrap={false}
        style={{
          position: "absolute",
          bottom: -3,
          left: 0,
          fontSize: "8",
          fontWeight: "light",
          paddingTop: 6,
          width: 200,
          textAlign: "left",
        }}
      >
        {`Printed on:  ${new Date().toLocaleDateString()}`}
      </Text>
    </View>
  </View>
);
