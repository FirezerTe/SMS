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

interface Payment {
  No: number;
  referenceNumber: string;
  paymentType: string;
  paymentInBirr: number;
  paymentInShares: number;
  paymentDate?: string;
  receiptNo: number;
  paymentMethod: number;
  remark: string;
}

interface Props {
  count: string;
  totalPaidUpInBirr: string;
  totalPaidUpShares: string;
  fromDate: string;
  toDate: string;
  shareholderName: string;
  shareholderId: number;
  payments: Payment[];
}
const ShareholderPaymentsReport = ({
  payments,
  totalPaidUpInBirr,
  totalPaidUpShares,
  fromDate,
  toDate,
  shareholderName,
  shareholderId
}: Props) => {
  const PaymentsList = payments.map((payment, index) => ({
    ...payment,
    No: index + 1,
  }));
const columns: Column<Payment>[] = [
  {
    header: "No",
    field: "No",
    widthInPercent: 5,
    footer: "Total",
  },
  {
    header: "Reference",
    field: "referenceNumber",
    widthInPercent: 16,
  },
  {
    header: "Payment Type",
    field: "paymentType",
    widthInPercent: 19,
  },
  {
    header: "Payment Date",
    field: "paymentDate",
    widthInPercent: 16,
  },
  {
    header: "Payment Method",
    field: "paymentMethod",
    widthInPercent: 21,
  },
  {
    header: "Total Paid Amount",
    field: "paymentInBirr",
    widthInPercent: 12,
    footer: totalPaidUpInBirr,
  },
  {
    header: "Paid Share",
    field: "paymentInShares",
    widthInPercent: 7,
    footer: totalPaidUpShares,
  },
];


  return (
    <ReportContainer>
      <Header title={reportConfigurations[Report.ShareholderPayments].title} />
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
            <Text style={{ fontSize: 12 }}>{shareholderName}</Text>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text style={{ fontSize: 12 }}>Shareholder Id:</Text>
              <Text style={{ fontSize: 12, marginLeft: 4 }}>
                {shareholderId}
              </Text>
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text>{`Payments made from`}</Text>
            <Text style={{ fontWeight: "light", marginLeft: 4 }}>
              {fromDate}
            </Text>
            <Text style={{ marginLeft: 4 }}>to</Text>
            <Text style={{ fontWeight: "light", marginLeft: 4 }}>{toDate}</Text>
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

export const getShareholderPaymentsReport = (request: Request) => (
  <ShareholderPaymentsReport {...request.body} />
);