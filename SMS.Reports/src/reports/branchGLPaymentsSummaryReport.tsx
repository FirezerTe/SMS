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

interface BranchPayments {
  No: number;
  amount: string;
  branchNewShareGL: string;
  businessUnitName: string;
  transactionReferenceNumber: string;
  transactionDate: string;
}

interface Props {
  branchPaymentTotal: string;
  fromDate: string;
  toDate: string;
  BusinessUnit: string;
  BranchPaymentList: BranchPayments[];
}
const BranchGLPaymentsSummaryReport = ({ BranchPaymentList,toDate ,fromDate,branchPaymentTotal}: Props) => {
  const BranchGLPaymentList = BranchPaymentList.map((payments, index) => ({
    ...payments,
    No: index + 1,
  }));
const columns: Column<BranchPayments>[] = [
  {
    header: "No",
    field: "No",
    widthInPercent: 12,
    footer:"Total"
  },
  {
    header: "Business Unit Name",
    field: "businessUnitName",
    widthInPercent: 30,
  },
  {
    header: "Branch New Share GL",
    field: "branchNewShareGL",
    widthInPercent: 30,
  },
  {
    header: "Amount",
    field: "amount",
    widthInPercent: 21,
    footer: branchPaymentTotal,
  },
];


  return (
    <ReportContainer>
      <Header
        title={reportConfigurations[Report.BranchGLPaymentsSummary].title}
      />
      <Content>
        <View
          fixed
          style={{
            paddingVertical: 4,
            display: "flex",
            flexDirection: "row",
            fontSize: 12,
            marginBottom: 8,
          }}
        ><View style={{ display: "flex", flexDirection: "row" }}>
        <Text>Payments Summary by Branch Made from </Text>
        <Text style={{ fontWeight: "light", marginLeft: 4 }}>{fromDate}</Text>
        <Text style={{ marginLeft: 4 }}> to </Text>
        <Text style={{ fontWeight: "light", marginLeft: 4 }}>{toDate}</Text>
      </View>
   
         </View>
        <View style={{ fontSize: 7 }}>
          <Table data={BranchGLPaymentList} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getBranchGLPaymentSummaryReport = (request: Request) => (
  <BranchGLPaymentsSummaryReport {...request.body} />
);