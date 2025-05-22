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
  No: number;
  shareholderId: number;
  shareholderName: string;
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

const NewPaymentsImpactingPaidUpGLReport = ({
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
      widthInPercent: 5,
      footer: "Total",
    },
    {
      header: "ShId",
      field: "shareholderId",
      widthInPercent: 6,
    },
    {
      header: "Shareholder Name",
      field: "shareholderName",
      widthInPercent: 21,
    },
    {
      header: "Branch Name",
      field: "branchName",
      widthInPercent: 16,
    },    
    {
      header: "Payment Date",
      field: "paymentDate",
      widthInPercent: 12,
    },
    {
      header: "Payment Type",
      field: "paymentType",
      widthInPercent: 15,
    },
    {
      header: "Reciept Number",
      field: "receiptNumber",
      widthInPercent: 15,
    },
    {
      header: "Payment Amount",
      field: "paymentAmount",
      widthInPercent: 12,
      footer: totalPaymentAmount,
    },
  ];

  return (
    <ReportContainer>
      <Header
        title={
          reportConfigurations[Report.NewPaymentsImpactingPaidUpGLReport].title
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

export const getNewPaymentsImpactingPaidUpGL = (request: Request) => (
  <NewPaymentsImpactingPaidUpGLReport {...request.body} />
);