import { Text, View } from "@react-pdf/renderer";
import {
  Column,
  Content,
  Footer,
  Header,
  ReportContainer,
  Table,
} from "../components";
import { Request } from "express";
import { Report } from "./types";
import { reportConfigurations } from "./reportConfigurations";

interface BankAllocations {
  name: string;
  description: string;
  amount: number;
  maxPercentagePurchaseLimit: number;
  createdAt?: string;
  sequence: number;
}

interface Props {
  fromDate: string;
  toDate: string;
  bankAllocations: BankAllocations[];
}

const columns: Column<BankAllocations>[] = [
  {
    header: "#No",
    field: "sequence",
    widthInPercent: 4,
  },
  {
    header: "Bank Allocation Name",
    field: "name",
    widthInPercent: 16,
  },
  {
    header: "Amount in Birr",
    field: "amount",
    widthInPercent: 12,
  },

  {
    header: "Purchase Limit",
    field: "maxPercentagePurchaseLimit",
    widthInPercent: 20,
  },
  {
    header: "Description",
    field: "description",
    widthInPercent: 16,
  },
  {
    header: "Allocation Date",
    field: "createdAt",
    widthInPercent: 10,
  },
];

const BankAllocationsReport = ({
  fromDate,
  toDate,
  bankAllocations,
}: Props) => {
  return (
    <ReportContainer>
      <Header title={reportConfigurations[Report.BankAllocations].title} />
      <View
        fixed
        style={{
          paddingVertical: 4,
          display: "flex",
          flexDirection: "row",
          fontSize: 8,
          marginBottom: 8,
        }}
      >
        <View style={{ flex: 1 }}></View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text>{`Bank Allocations from`}</Text>
          <Text style={{ fontWeight: "light", marginLeft: 4 }}>{fromDate}</Text>
          <Text style={{ marginLeft: 4 }}>to</Text>
          <Text style={{ fontWeight: "light", marginLeft: 4 }}>{toDate}</Text>
        </View>
      </View>
      <Content>
        <View style={{ fontSize: 7 }}>
          <Table data={bankAllocations} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getBankAllocations = (request: Request) => (
  <BankAllocationsReport {...request.body} />
);