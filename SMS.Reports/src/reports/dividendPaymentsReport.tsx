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

interface Payment {
  shareholderId: number;
  shareholderName: string;
  paymentAmount: number;
  paymentDate?: string;
  remark: string;
}

interface Props {
  fromDate: string;
  toDate: string;
  payments: Payment[];
}

const columns: Column<Payment>[] = [
  {
    header: "Shareholder Id",
    field: "shareholderId",
    widthInPercent: 12,
  },
  {
    header: "Shareholder Name",
    field: "shareholderName",
    widthInPercent: 35,
  },
  {
    header: "Payment Amount",
    field: "paymentAmount",
    widthInPercent: 15,
  },
  {
    header: "Payment Date",
    field: "paymentDate",
    widthInPercent: 15,
  },

  {
    header: "Remark",
    field: "remark",
  },
];

const DividendPaymentsReport = ({ fromDate, toDate, payments }: Props) => {
  return (
    <ReportContainer>
      <Header title={reportConfigurations[Report.DividendPayments].title} />
      <Content>
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
            <Text>{`Payments from`}</Text>
            <Text style={{ fontWeight: "light", marginLeft: 4 }}>
              {fromDate}
            </Text>
            <Text style={{ marginLeft: 4 }}>to</Text>
            <Text style={{ fontWeight: "light", marginLeft: 4 }}>{toDate}</Text>
          </View>
        </View>
        <View style={{ fontSize: 7 }}>
          <Table data={payments} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getDividendPaymentsReport = (request: Request) => (
  <DividendPaymentsReport {...request.body} />
);
