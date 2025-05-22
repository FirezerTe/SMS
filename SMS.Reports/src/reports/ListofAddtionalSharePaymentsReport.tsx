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
import { reportConfigurations } from "./reportConfigurations";
import { Report } from "./types";

interface Payments {
  shareholderId: number;
  shareholderName: string;
  paymentAmount: number;
  paymentDate: string;
  receiptNumber: string;
  subscriptionInfo: string;
  paymentType: string;
}

interface Props {
  fromDate: string;
  toDate: string;
  payments: Payments[];
  totalPaymentAmount: number;
}

const columns: Column<Payments>[] = [
  {
    header: "Shareholder Id",
    field: "shareholderId",
    widthInPercent: 10,
  },
  {
    header: "Shareholder Name",
    field: "shareholderName",
    widthInPercent: 15,
  },
  {
    header: "Subscription Info",
    field: "subscriptionInfo",
    widthInPercent: 15,
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
    header: "Payment Type",
    field: "paymentType",
    widthInPercent: 15,
  },
  {
    header: "Reciept Number",
    field: "receiptNumber",
    widthInPercent: 20,
  },
];

const ListofAddtionalSharePaymentMadeReport = ({
  fromDate,
  toDate,
  payments,
  totalPaymentAmount,
}: Props) => {
  return (
    <ReportContainer>
      <Header title={reportConfigurations[Report.AddtionalShareReport].title} />
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
          <Text style={{ fontWeight: "light", marginLeft: 4 }}>{fromDate}</Text>
          <Text style={{ marginLeft: 4 }}>to</Text>
          <Text style={{ fontWeight: "light", marginLeft: 4 }}>{toDate}</Text>
        </View>
        <View style={{ flex: 1 }}></View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text>{`Total Amount of Payments Made  `}</Text>
          <Text style={{ fontWeight: "light", marginLeft: 4 }}>
            {totalPaymentAmount}
          </Text>
        </View>
      </View>
      <Content>
        <View style={{ fontSize: 7 }}>
          <Table data={payments} columns={columns} />
        </View>
      </Content>

      <Footer></Footer>
    </ReportContainer>
  );
};

export const getListOfAddtionalSharePayments = (request: Request) => (
  <ListofAddtionalSharePaymentMadeReport {...request.body} />
);
