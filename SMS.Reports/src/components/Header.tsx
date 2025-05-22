import { Text, View } from "@react-pdf/renderer";
import { Divider } from "./Divider";
import { Logo } from "./Logo";

export const Header = ({ title }: { title: string }) => (
  <View fixed>
    <View style={{ display: "flex", flexDirection: "row" }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12 }}>Shareholder Management System</Text>
        <Text style={{ fontSize: 14, color: "#003da5" }}>{title}</Text>
      </View>

      <View
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Logo height={30} />
      </View>
    </View>
    <Divider />
  </View>
);
