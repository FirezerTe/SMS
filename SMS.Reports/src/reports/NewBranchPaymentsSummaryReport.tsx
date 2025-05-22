import { Text, View } from "@react-pdf/renderer";
import {
  Column,
  Content,
  Footer,
  Header,
  ReportContainer,
  Table,
} from "../components/index";
import { Request } from "express";
import { reportConfigurations } from "./reportConfigurations";
import { Report } from "./types";

interface Payments {
  No: number;
  shareholderId: number;
  shareholderName: string;
  branchNewShareGL: string;   
  paymentAmount: number;
  paymentDate: string;
  receiptNumber: string;    
  subscriptionInfo: string;     
  paymentType: string;  
  branchName: string;
}

interface Props {
  fromDate: string;
  toDate: string;
  payments: Payments[];
  totalPaymentAmount: string;
}

const NewBranchPaymentsSummaryReport = ({
  fromDate,
  toDate,
  payments,
  totalPaymentAmount,
}: Props) => {
  const PaymentsList = payments.map((payment, index) => ({
    ...payment,
    No: index + 1,
  }));
  const columns: Column<Payments>[] = [
    {
      header: "No",
      field: "No",
      widthInPercent: 12,
      footer: "Total",
    },
    {
      header: "Branch New Share Account",
      field: "branchNewShareGL",
      widthInPercent: 31,
    },
    {
      header: "Branch Name",
      field: "branchName",
      widthInPercent: 26,
    },    
    
    {
      header: "Payment Amount",
      field: "paymentAmount",
      widthInPercent: 19,
      footer: totalPaymentAmount,
    },
  ];

  return (
    <ReportContainer>
      <Header
        title={
          reportConfigurations[Report.NewBranchPaymentsSummary].title
        }
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
        <View style={{ flex: 1 }}></View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text>{`Payments from`}</Text>
          <Text style={{ fontWeight: "light", marginLeft: 4 }}>{fromDate}</Text>
          <Text style={{ marginLeft: 4 }}>to</Text>
          <Text style={{ fontWeight: "light", marginLeft: 4 }}>{toDate}</Text>
        </View>
        <View style={{ flex: 1 }}></View>
      </View>
      <Content>
        <View style={{ fontSize: 7 }}>
          <Table data={PaymentsList} columns={columns} />
        </View>
      </Content>

      <Footer></Footer>
    </ReportContainer>
  );
};

export const getBranchSharePaymentsSummary = (request: Request) => (
  <NewBranchPaymentsSummaryReport {...request.body} />
);