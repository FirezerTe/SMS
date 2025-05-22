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
import { Report } from "./types";
import { reportConfigurations } from "./reportConfigurations";

interface Subscription {
  subscriptionShareHolderID: number;
  subscriptionShareHolderName: string;
  subscriptionAmount: number;
  subscriptionDate?: string;
}

interface Props {
  topSubscription: number;
  topShareholderSubscriptions: Subscription[];
}

const columns: Column<Subscription>[] = [
  {
    header: "Shareholder Id",
    field: "subscriptionShareHolderID",
    widthInPercent: 12,
  },
  {
    header: "Shareholder Name",
    field: "subscriptionShareHolderName",
    widthInPercent: 20,
  },
  {
    header: "Subscription Amount",
    field: "subscriptionAmount",
    widthInPercent: 14,
  },

  {
    header: "Subscription Date",
    field: "subscriptionDate",
    widthInPercent: 12,
  },
];

const TopSubscriptionsReport = ({
  topShareholderSubscriptions,
  topSubscription,
}: Props) => {
  return (
    <ReportContainer>
      <Header title={reportConfigurations[Report.TopSubscriptions].title} />
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
          <Text>{`Top `}</Text>
          <Text style={{ fontWeight: "light", marginLeft: 4 }}>
            {topSubscription}
          </Text>
          <Text style={{ marginLeft: 4 }}>{`Shareholder List`}</Text>
        </View>
      </View>
      <Content>
        <View style={{ fontSize: 7 }}>
          <Table data={topShareholderSubscriptions} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getTopSubscriptionsReport = (request: Request) => (
  <TopSubscriptionsReport {...request.body} />
);
