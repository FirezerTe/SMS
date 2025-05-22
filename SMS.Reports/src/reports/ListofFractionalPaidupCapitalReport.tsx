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

interface paymentsTot {
  shareHolderId: number;
  shareholderName: string;
  totalPayments: number;
}

interface Props {
  paymentsTotal: paymentsTot[];
}

const columns: Column<paymentsTot>[] = [
  {
    header: "Shareholder Id",
    field: "shareHolderId",
    widthInPercent: 12,
  },
  {
    header: "Shareholder Name",
    field: "shareholderName",
    widthInPercent: 50,
  },
  {
    header: "Fractional Paidup Amount",
    field: "totalPayments",
    widthInPercent: 20,
  },
];

const ListofFractionalPaidupReport = ({ paymentsTotal }: Props) => {
  return (
    <ReportContainer>
      <Header
        title={reportConfigurations[Report.FractionalPaidupCapital].title}
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
        >
          <View style={{ flex: 1 }}></View>
          <View style={{ display: "flex", flexDirection: "row" }}></View>
        </View>
        <View style={{ fontSize: 7 }}>
          <Table data={paymentsTotal} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getListOfFractionalPaidup = (request: Request) => (
  <ListofFractionalPaidupReport {...request.body} />
);
