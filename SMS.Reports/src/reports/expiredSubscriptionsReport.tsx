import { Text, View } from "@react-pdf/renderer";
import {
  Content,
  Footer,
  Header,
  ReportContainer,
} from "../components";
import { Request } from "express";
import { Report } from "./types";
import { reportConfigurations } from "./reportConfigurations";
import { Column, Table } from "../components/TableCompose";

interface Subscription {
  shareholderId: number;
  shareholderName: string;
  subscriptionGroup: string;
  subscriptionOriginalReferenceNo: string;
  amount: number;
  subscriptionDate?: string;
  expiryDate?: string;
  workflowComment: string;
  dueDate: string;
  totalPayment: number;
  expiredAmount: number;
  sequence: number;
}

interface Props {
  fromDate: string;
  toDate: string;
  expiredSubscriptions: Subscription[];
  totalExpiredAmount: number;
}

const ExpiredSubscriptionsReport = ({
  fromDate,
  toDate,
  expiredSubscriptions,
  totalExpiredAmount,
}: Props) => {
  const totalSubscription = expiredSubscriptions.reduce(
    (total, subscription) => (total + subscription.amount) as any,
    0
  );
  const totalPaidup = expiredSubscriptions.reduce(
    (total, paid) => (total + paid.totalPayment) as any,
    0
  );
  const totalExpired = expiredSubscriptions.reduce(
    (total, expired) => (total + expired.expiredAmount) as any,
    0
  );

  const columns: Column<Subscription>[] = [
    {
      header: "#No",
      field: "sequence",
      widthInPercent: 4,
    },
    {
      header: "Shareholder Id",
      field: "shareholderId",
      widthInPercent: 12,
    },
    {
      header: "Shareholder Name",
      field: "shareholderName",
      widthInPercent: 16,
    },
    {
      header: "subscription Group",
      field: "subscriptionGroup",
      widthInPercent: 18,
    },

    {
      header: "Subscription Date",
      field: "subscriptionDate",
      widthInPercent: 10,
    },

    {
      header: "Due Date",
      field: "dueDate",
      widthInPercent: 10,
      footer: "Total :",
    },
    {
      header: "Subscription Amount ",
      field: "amount",
      widthInPercent: 12,
      footer: totalSubscription as any,
    },
    {
      header: "Paid Amount",
      field: "totalPayment",
      widthInPercent: 12,
      footer: totalPaidup as any,
    },
    {
      header: "Expired Amount",
      field: "expiredAmount",
      widthInPercent: 12,
      footer: totalExpired as any,
    },
  ];
  return (
    <ReportContainer>
      <Header title={reportConfigurations[Report.ExpiredSubscriptions].title} />
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
            <Text>Total Expired Subscription:</Text>
            <Text style={{ fontWeight: "light", marginLeft: 4 }}>
              {totalExpiredAmount}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }}></View>
        {!!fromDate &&
          !!toDate &&
          fromDate !== "01 January 0001" &&
          toDate !== "01 January 0001" && (
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text>{`Expired Subscriptions from`}</Text>
              <Text style={{ fontWeight: "light", marginLeft: 4 }}>
                {fromDate}
              </Text>
              <Text style={{ marginLeft: 4 }}>to</Text>
              <Text style={{ fontWeight: "light", marginLeft: 4 }}>
                {toDate}
              </Text>
            </View>
          )}
      </View>
      <Content>
        <View style={{ fontSize: 7 }}>
          <Table data={expiredSubscriptions} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getExpiredSubscriptionsReport = (request: Request) => (
  <ExpiredSubscriptionsReport {...request.body} />
);