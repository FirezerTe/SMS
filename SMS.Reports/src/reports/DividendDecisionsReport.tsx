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

interface DividendDecision {
  No: number;
  shareholderId: string;
  shareholderName: string;
  DecisionDate: string;
  decisionType: string;
  withdrawalAmount: string;
  capitalizedAmount: string;
  FulfillmentAmount: string;
  dividendAmount: string;
  Tax: string;
}

interface Props {
  totalWithdrawAmount: string;
  totalDividendAmount: string;
  totalCapitalizedAmount: string;
  totalTax: string;
  fromDate: string;
  toDate: string;
  dividendDecision: DividendDecision[];
}
const DividendDecisionsReport = ({ dividendDecision,totalDividendAmount,totalWithdrawAmount ,totalCapitalizedAmount,totalTax,fromDate,toDate}: Props) => {
  const dividendDecisionList = dividendDecision.map((decision, index) => ({
    ...decision,
    No: index + 1,
  }));
const columns: Column<DividendDecision>[] = [
  {
    header: "No",
    field: "No",
    widthInPercent: 5,
    footer:"Total"
  },
  {
    header: "Sh No.",
    field: "shareholderId",
    widthInPercent: 6,
  },
  {
    header: "Shareholder Name",
    field: "shareholderName",
    widthInPercent: 21,
  },
  {
    header: "Decision Date",
    field: "DecisionDate",
    widthInPercent: 12,
  },
  {
    header: "Decision Type",
    field: "decisionType",
    widthInPercent: 12,
  },
  {
    header: "Dividend Amount",
    field: "dividendAmount",
    widthInPercent: 12,
    footer: totalDividendAmount,
  },
  {
    header: "Capitalized Amount",
    field: "capitalizedAmount",
    widthInPercent: 12,
    footer: totalCapitalizedAmount
  },
  {
    header: "Withdrawn Amount",
    field: "withdrawalAmount",
    widthInPercent: 12,
    footer: totalWithdrawAmount,
  },
  {
    header: "Tax",
    field: "Tax",                              
    widthInPercent: 12,
    footer: totalTax
  },
];


  return (
    <ReportContainer>
      <Header
        title={reportConfigurations[Report.DividendDecisionsReport].title}
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
        <Text>Dividend Decision Made from </Text>
        <Text style={{ fontWeight: "light", marginLeft: 4 }}>{fromDate}</Text>
        <Text style={{ marginLeft: 4 }}> to </Text>
        <Text style={{ fontWeight: "light", marginLeft: 4 }}>{toDate}</Text>
      </View>
   
         </View>
        <View style={{ fontSize: 7 }}>
          <Table data={dividendDecisionList} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getDividendDecisionReport = (request: Request) => (
  <DividendDecisionsReport {...request.body} />
);
