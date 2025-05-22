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
import { count } from "console";

interface paymentsTot {
  No: number;
  shareHolderId: number;
  shareholderName: string;
  totalPayments: number;
  totalShareValue: number;
}

interface Props {
  count: string;
  paymentsTotal: paymentsTot[];
  totalPaymentAmount: string;
  totalNoOfShares: string;
}

const TopShareholderByPaidupCapitalReport = ({
  count,
  paymentsTotal,
  totalPaymentAmount,
  totalNoOfShares,
}: Props) => {
  // Add No to each payment item
  const PaymentsList = paymentsTotal.map((payment, index) => ({
    ...payment,
    No: index + 1,
  }));
  const columns: Column<paymentsTot>[] = [
    {
      header: "No",
      field: "No",
      widthInPercent: 8,
      footer: "Total",
    },
    {
      header: "Shareholder Id",
      field: "shareHolderId",
      widthInPercent: 12,
    },
    {
      header: "Shareholder Name",
      field: "shareholderName",
      widthInPercent: 45,
    },
    {
      header: "Total Paidup Amount",
      field: "totalPayments",
      widthInPercent: 20,
      footer: totalPaymentAmount,
    },
    {
      header: "Total No of Shares",
      field: "totalShareValue",
      widthInPercent: 12,
      footer: totalNoOfShares,
    },
  ];
  return (
    <ReportContainer>
      <Header
        title={reportConfigurations[Report.TopShareholderByPaidup].title}
      />
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
            <Text style={{ fontWeight: "light", marginLeft: 4 }}>
              Top {count} Shareholders By PaidUp
            </Text>
          </View>
        </View>
        <View style={{ fontSize: 7 }}>
          <Table data={PaymentsList} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getTopShareholderByPaidupCapitalReport = (request: Request) => (
  <TopShareholderByPaidupCapitalReport {...request.body} />
);