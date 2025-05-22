import { Text, View } from "@react-pdf/renderer";
import {
  Content,
  Footer,
  Header,
  ReportContainer,
  Table,
} from "../components";
import { Request } from "express";
import { Report } from "./types";
import { reportConfigurations } from "./reportConfigurations";
import { Column } from "../components/TableCompose";

interface OutstandingAllocations {
  createdAt: string;
  allocationRemaining: number;
  allocationTotalPaidUp: number;
  name: string;
  toDate: string;
  amount: number;
  fromDate: string;
  totalAmount?: number;
  sequence: number;
}

interface Props {
  fromDate: string;
  toDate: string;
  outstandingAllocations: OutstandingAllocations[];
  totalAmount: number;
}

const OutstandingAllocationsReport = ({
  fromDate,
  toDate,
  outstandingAllocations,
  totalAmount,
}: Props) => {
  const totalAllocation = outstandingAllocations.reduce(
    (total, allocation) => (total + allocation.amount) as any,
    0
  );
  const totalSubscribed = outstandingAllocations.reduce(
    (total, allocation) => (total + allocation.allocationTotalPaidUp) as any,
    0
  );
  const totalRemaining = outstandingAllocations.reduce(
    (total, allocation) => (total + allocation.allocationRemaining) as any,
    0
  );

  const columns: Column<OutstandingAllocations>[] = [
    {
      header: "#No",
      field: "sequence",
      widthInPercent: 4,
    },
    {
      header: "Allocation Name",
      field: "name",
      widthInPercent: 20,
    },

    {
      header: "Allocation Date",
      field: "createdAt",
      widthInPercent: 14,
      footer: "Total :",
    },
    {
      header: "Allocation Amount",
      field: "amount",
      widthInPercent: 14,
      footer: totalAllocation as any,
    },
    {
      header: "Allocation Subscribed",
      field: "allocationTotalPaidUp",
      widthInPercent: 16,
      footer: totalSubscribed as any,
    },
    {
      header: "Allocation Remaining",
      field: "allocationRemaining",
      widthInPercent: 16,
      footer: totalRemaining as any,
    },
  ];

  return (
    <ReportContainer>
      <Header
        title={reportConfigurations[Report.OutstandingAllocations].title}
      />
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
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10 }}>{}</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text>Total Allocation Remaining:</Text>
            <Text style={{ fontWeight: "light", marginLeft: 4 }}>
              {totalAmount}
            </Text>
          </View>
        </View>
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
          <Table data={outstandingAllocations} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getOutstandingAllocationsReport = (request: Request) => (
  <OutstandingAllocationsReport {...request.body} />
);