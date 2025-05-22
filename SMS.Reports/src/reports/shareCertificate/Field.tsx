import { Text, View } from "@react-pdf/renderer";
import { PropsWithChildren } from "react";

export const Field = ({
  amharicLabel,
  englishLabel,
  value = "",
  labelOnly = false,
  children,
  underline = true,
  isAmharicValue = false,
}: {
  amharicLabel?: string;
  englishLabel?: string;
  value?: string | number;
  labelOnly?: boolean;
  underline?: boolean;
  isAmharicValue?: boolean;
} & PropsWithChildren) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginVertical: 8,
      }}
    >
      {amharicLabel && (
        <Text
          style={{
            fontFamily: "Amharic",
            width: (amharicLabel && englishLabel && "100%") || undefined,
          }}
        >
          {amharicLabel}
        </Text>
      )}
      {englishLabel && <Text>{englishLabel}</Text>}
      {!labelOnly && (
        <View
          style={{
            flex: 1,
            fontFamily: isAmharicValue ? "Amharic" : undefined,
            borderBottomStyle: "dotted",
            borderBottomWidth: (underline && 0.3) || 0,
            fontWeight: "light",
            marginLeft: "4",
            borderBottomColor: "#D3D3D3",
          }}
        >
          {children ? children : <Text>{value}</Text>}
        </View>
      )}
    </View>
  );
};
