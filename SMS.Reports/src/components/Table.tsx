import { Text, View } from "@react-pdf/renderer";

interface Props<T extends object> {
  data: T[];
  columns: Column<T>[];
  verticalRowPadding?: number;
  horizontalRowPadding?: number;
  verticalHeaderPadding?: number;
  horizontalHeaderPadding?: number;
}

export interface Column<T extends object> {
  header: string;
  widthInPercent?: number;
  field: keyof T;
  footer?: string;
}

export const Table = <T extends object>({
  data = [],
  columns,
  verticalHeaderPadding = 2,
  horizontalHeaderPadding = 2,
  verticalRowPadding = 2,
  horizontalRowPadding = 2,
}: Props<T>) => {
  const definedWidth = columns
    .filter((c) => c.widthInPercent !== undefined)
    .reduce((curr, column) => {
      return curr + (column.widthInPercent || 0);
    }, 0);

  const defaultColumnWidth =
    (100 - definedWidth) /
    (columns.filter((c) => c.widthInPercent === undefined).length || 1);

  return (
    <View>
      <View
        fixed
        style={{
          display: "flex",
          flexDirection: "row",
          borderBottomWidth: 0.5,
          borderBottomColor: "lightgray",
        }}
      >
        {columns.map((c, colIndex) => (
          <View
            key={colIndex}
            style={{
              paddingVertical: verticalHeaderPadding,
              paddingHorizontal: horizontalHeaderPadding,
              flex: colIndex === columns.length - 1 ? 1 : undefined,
              width:
                colIndex === columns.length - 1
                  ? undefined
                  : `${c.widthInPercent || defaultColumnWidth}%`,
              fontWeight: "black",
            }}
          >
            <Text>{c.header}</Text>
          </View>
        ))}
      </View>
      <View>
        {data.map((item, index) => (
          <View style={{ display: "flex", flexDirection: "row" }} key={index}>
            {columns.map((c, colIndex) => (
              <View
                key={colIndex}
                style={{
                  paddingVertical: verticalRowPadding,
                  paddingHorizontal: horizontalRowPadding,
                  flex: colIndex === columns.length - 1 ? 1 : undefined,
                  width:
                    colIndex === columns.length - 1
                      ? undefined
                      : `${c.widthInPercent || defaultColumnWidth}%`,
                  backgroundColor: index % 2 ? "lightgray" : undefined,
                }}
              >
                <Text>{item[c.field]}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      <View
        fixed
        style={{
          display: "flex",
          flexDirection: "row",
          borderBottomWidth: 1,
          borderTopColor: "black",
          borderTopWidth: 1,
          borderBottomColor: "black",
        }}
      >
        {columns.map((c, colIndex) => (
          <View
            key={colIndex}
            style={{
              paddingVertical: verticalHeaderPadding,
              paddingHorizontal: horizontalHeaderPadding,
              flex: colIndex === columns.length - 1 ? 1 : undefined,
              width:
                colIndex === columns.length - 1
                  ? undefined
                  : `${c.widthInPercent || defaultColumnWidth}%`,
              fontWeight: "black",
            }}
          >
            <Text>{c.footer}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
