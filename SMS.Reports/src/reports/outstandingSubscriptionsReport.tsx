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

interface OutstandingSubscription {
  subscriptionShareHolderID: number;
  subscriptionDate: string;
  subscriptionAmount: number;
  subscriptionPaidUpAmount: number;
  subscriptionOutstandingAmount: number;
  subscriptionShareHolderName: string;
  sequence: number;
}

interface Props {
  fromDate: string;
  toDate: string;
  outstandingShareSubscriptions: OutstandingSubscription[];
  totalOutstandingSubscription: number;
}

const OutstandingSubscriptionsReport = ({
  fromDate,
  toDate,
  outstandingShareSubscriptions,
  totalOutstandingSubscription,
}: Props) => {
  const totalSubscription = outstandingShareSubscriptions.reduce(
    (total, subscription) => total + subscription.subscriptionAmount,
    0
  );
  const totalPayment = outstandingShareSubscriptions.reduce(
    (total, payment) => (total + payment.subscriptionPaidUpAmount) as any,
    0
  );
  const totalOutstanding = outstandingShareSubscriptions.reduce(
    (total, outstanding) =>
      (total + outstanding.subscriptionOutstandingAmount) as any,
    0
  );

  const columns: Column<OutstandingSubscription>[] = [
    {
      header: "#No",
      field: "sequence",
      widthInPercent: 4,
    },
    {
      header: "Shareholder Id",
      field: "subscriptionShareHolderID",
      widthInPercent: 12,
    },
    {
      header: "Shareholder Name",
      field: "subscriptionShareHolderName",
      widthInPercent: 22,
    },

    {
      header: "Subscription Date",
      field: "subscriptionDate",
      widthInPercent: 14,
      footer: "Total :",
    },
    {
      header: "Subscription Amount",
      field: "subscriptionAmount",
      widthInPercent: 15,
      footer: totalSubscription as any,
    },

    {
      header: "Payment Amount",
      field: "subscriptionPaidUpAmount",
      widthInPercent: 15,
      footer: totalPayment as any,
    },
    {
      header: "Outstanding Subscription",
      field: "subscriptionOutstandingAmount",
      widthInPercent: 16,
      footer: totalOutstanding as any,
    },
  ];

  return (
    <ReportContainer>
      <Header
        title={reportConfigurations[Report.OutstandingSubscriptions].title}
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
        <View style={{ flex: 1 }}>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text>Total Outstanding Subscription:</Text>
            <Text style={{ fontWeight: "light", marginLeft: 4 }}>
              {totalOutstandingSubscription}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }}></View>
        {!!fromDate &&
          !!toDate &&
          fromDate !== "01 January 0001" &&
          toDate !== "01 January 0001" && (
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text>{`Subscriptions from`}</Text>
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
          <Table data={outstandingShareSubscriptions} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getOutstandingSubscriptionsReport = (request: Request) => (
  <OutstandingSubscriptionsReport {...request.body} />
);