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

interface paymentsTot {
  shareHolderId: number;
  shareholderName: string;
  totalPayments: number;
  totalShareValue: number;
}

interface Props {
  toDate: string;
  paymentsTotal: paymentsTot[];
  totalPaymentAmount: string;
}

const columns: Column<paymentsTot>[] = [
  {
    header: "Shareholder Id",
    field: "shareHolderId",
    widthInPercent: 12,
  },
  {
    header: "Shareholder Name",
    field: "shareholderName",
    widthInPercent: 20,
  },
  {
    header: "Total Paidup Amount",
    field: "totalPayments",
    widthInPercent: 20,
  },
  {
    header: "Total Paidup In Share",
    field: "totalShareValue",
    widthInPercent: 12,
  },
];

const PaidupBalanceReport = ({
  toDate,
  paymentsTotal,
  totalPaymentAmount,
}: Props) => {
  return (
    <ReportContainer>
      <Header title={reportConfigurations[Report.PaidupBalance].title} />
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
          <View style={{ flex: 1 }}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text>Paid Up Balance till:</Text>
              <Text style={{ fontWeight: "light", marginLeft: 4 }}>
                {toDate}
              </Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text>{`Total Amount of Payments Made  `}</Text>
              <Text style={{ fontWeight: "light", marginLeft: 4 }}>
                {totalPaymentAmount}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ fontSize: 7 }}>
          <Table data={paymentsTotal} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getPaidupBalanceReport = (request: Request) => (
  <PaidupBalanceReport {...request.body} />
);
