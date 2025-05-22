import { Text, View } from "@react-pdf/renderer";

export const Title = () => {
  return (
    <View
      style={{
        textAlign: "center",
        color: "#003da5",
        fontWeight: "bold",
      }}
    >
      <Text style={{ fontFamily: "Amharic" }}>የአክሲዮን የምስክር ወረቀት</Text>
      <Text>SHARE CERTIFICATE</Text>
    </View>
  );
};
