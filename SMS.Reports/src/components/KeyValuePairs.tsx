import { Text, View } from "@react-pdf/renderer";

export const KeyValuePairs = ({
  data,
}: {
  data: { label: string; value: string }[];
}) => (
  <>
    {data.map(({ label, value }, index) => (
      <View key={index}>
        <Text>{label}</Text>
        <Text>{value}</Text>
      </View>
    ))}
  </>
);
