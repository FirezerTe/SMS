import { Text, View } from "@react-pdf/renderer";
import {
  Content,
  Footer,
  Header,
  ReportContainer,
  Table,
} from "../components";
import { Request } from "express";
import { Report } from "./types";
import { reportConfigurations } from "./reportConfigurations";
import { Column } from "../components/TableCompose";

interface premiumCollect {
  shareholderId: number;
  premiumPayment: number;
  totalCollected: number;
  shareholderName: string;
  amount: number;
  subscriptionDate?: string;
  sequence: number;
}

interface Props {
  fromDate: string;
  toDate: string;
  premiumCollection: premiumCollect[];
  totalPremiumCollected: number;
}

const PremiumCollectionReport = ({
  fromDate,
  toDate,
  premiumCollection,
  totalPremiumCollected,
}: Props) => {
  const totalAmount = premiumCollection.reduce(
    (total, subscription) => total + subscription.amount,
    0
  );
  const totalPremium = premiumCollection.reduce(
    (total, premium) => (total + premium.premiumPayment) as any,
    0
  );
  const columns: Column<premiumCollect>[] = [
    {
      header: "#No",
      field: "sequence",
      widthInPercent: 4,
    },
    {
      header: "Shareholder ID",
      field: "shareholderId",
      widthInPercent: 12,
    },
    {
      header: "Shareholder Name",
      field: "shareholderName",
      widthInPercent: 18,
    },
    {
      header: "Collection Date",
      field: "subscriptionDate",
      widthInPercent: 14,
      footer: "Total :",
    },
    {
      header: "Subscribed Amount",
      field: "amount",
      widthInPercent: 14,
      footer: totalAmount as any,
    },

    {
      header: "Premium Collected",
      field: "premiumPayment",
      widthInPercent: 14,
      footer: totalPremium as any,
    },
  ];
  return (
    <ReportContainer>
      <Header title={reportConfigurations[Report.PremiumCollction].title} />
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
            <Text>Total Premium Collected:</Text>
            <Text style={{ fontWeight: "light", marginLeft: 4 }}>
              {totalPremiumCollected}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}></View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text>{`Premium Collection from`}</Text>
          <Text style={{ fontWeight: "light", marginLeft: 4 }}>{fromDate}</Text>
          <Text style={{ marginLeft: 4 }}>to</Text>
          <Text style={{ fontWeight: "light", marginLeft: 4 }}>{toDate}</Text>
        </View>
      </View>
      <Content>
        <View style={{ fontSize: 7 }}>
          <Table data={premiumCollection} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getPremiumCollectionReport = (request: Request) => (
  <PremiumCollectionReport {...request.body} />
);