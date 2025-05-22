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

interface DividendDecisions {
  No: number;
  shareholderId: string;
  shareholderName: string;
  DecisionDate: string;
  decisionType: string;
  withdrawnAmount: string;
  capitalisedAmount: string;
  fulfillmentAmount: string;  
  desiredAmount: string; 
}

interface Props {
  totalWithdrawAmount: string;
  totalCapitalizedAmount: string;
  ShareholderDividendDecision: DividendDecisions[];
}



const ShareholderDividendDecisionReport = ({ ShareholderDividendDecision,totalWithdrawAmount ,totalCapitalizedAmount}: Props) => {
  const ShareholderDividendDecisionList = ShareholderDividendDecision.map((decision, index) => ({
    ...decision,
    No: index + 1,
  }));
  const columns: Column<DividendDecisions>[] = [
    {
      header: "No",
      field: "No",
      widthInPercent: 5,
      footer:"Total"
    },
    {
      header: "Decision Date",
      field: "DecisionDate",
      widthInPercent: 16,
    },
    {
      header: "Decision Type",
      field: "decisionType",
      widthInPercent: 15,
    },
    {
      header: "Withdrawn Amount",
      field: "withdrawnAmount",
      widthInPercent: 16,
      footer: totalWithdrawAmount,
    },
    {
      header: "Capitalized Amount",
      field: "capitalisedAmount",
      widthInPercent: 16,
      footer: totalCapitalizedAmount
    },
    {
      header: "Fulfillment Amount",
      field: "fulfillmentAmount",
      widthInPercent: 16,
    },
    {
      header: "Desired Subscription",
      field: "desiredAmount",
      widthInPercent: 16,
    },
  ];
  return (
    <ReportContainer>
      <Header
        title={reportConfigurations[Report.ShareholderDividendDecisionReport].title}
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
        ></View>
        <View style={{ fontSize: 7 }}>
          <Table data={ShareholderDividendDecisionList} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getShareholderDividendDecisionReport = (request: Request) => (
  <ShareholderDividendDecisionReport {...request.body} />
);
