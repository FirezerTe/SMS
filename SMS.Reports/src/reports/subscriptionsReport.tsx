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
import React from "react";
import { compile } from "morgan";
import { Column } from "../components/TableCompose";

interface Subscription {
  subscriptionPaidup: {
    shareholderId: number;
    shareholderName: string;
    subscriptionGroup: string;
    subscriptionOriginalReferenceNo: string;
    amount: number;
    premiumPaymentReceiptNo: string;
    subscriptionDate?: string;
    expiryDate?: string;
    workflowComment: string;
    total: number;
  };
  shareholderId: number;
  shareholderName: string;
  subscriptionGroup: string;
  subscriptionOriginalReferenceNo: string;
  amount: number;
  premiumPayment: string;
  subscriptionDate?: string;
  expiryDate?: string;
  workflowComment: string;
  total: number;
  sequenceNumber: number;
  share: number;
}
interface Props {
  fromDate: string;
  toDate: string;
  subscriptions: Subscription[];
}

const SubscriptionsReport = ({ fromDate, toDate, subscriptions }: Props) => {
  const totalAmount = subscriptions.reduce(
    (total, subscription) => total + subscription.amount,
    0
  );
  const totalPremium = subscriptions.reduce(
    (total, premium) => (total + premium.premiumPayment) as any,
    0
  );
  const totalShare = subscriptions.reduce(
    (total, share) => total + share.share,
    0
  );

  const columns: Column<Subscription>[] = [
    {
      header: "#No",
      field: "sequenceNumber",
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
      widthInPercent: 24,
    },
    {
      header: "subscription Group",
      field: "subscriptionGroup",
      widthInPercent: 16,
    },
    {
      header: "Date",
      field: "subscriptionDate",
      widthInPercent: 12,
      footer: "Total : ",
    },
    {
      header: " Share",
      field: "share",
      widthInPercent: 8,
      footer: totalShare as any,
    },
    {
      header: " Amount",
      field: "amount",
      widthInPercent: 10,
      footer: totalAmount as any,
    },
    {
      header: "Premium Payment",
      field: "premiumPayment",
      widthInPercent: 10,
      footer: totalPremium as any,
    },
  ];

  return (
    <ReportContainer>
      <Header title={reportConfigurations[Report.Subscriptions].title} />
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
          <Table data={[...subscriptions] as any} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getSubscriptionsReport = (request: Request) => (
  <SubscriptionsReport {...request.body} />
);