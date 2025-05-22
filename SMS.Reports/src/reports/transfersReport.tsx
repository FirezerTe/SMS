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

interface Transfer {
  fromShareholderId: number;
  fromShareholderName: string;
  toShareholderId: number;
  toShareholderName: string;
  amount: number;
  numberOfShares: number;
  transferDate?: string;
  transferType?:string;
  dividendTerm:string;
}


interface TransferGridItem {
  No: number;
  from: string;
  to: string;
  amount: number;
  numberOfShares: number;
  transferDate?: string;
  transferType?:string;
  dividendTerm:string;
}
interface Props {
  fromDate: string;
  toDate: string;
  totalTransferAmount:string;
  totalShare:string;
  transfers: Transfer[];
}


const TransfersReport = ({ fromDate, toDate,totalShare,totalTransferAmount, transfers }: Props) => {
  const records = transfers.map<TransferGridItem>(
    ({
      fromShareholderId,
      fromShareholderName,
      toShareholderId,
      toShareholderName,
      amount,
      numberOfShares,
      transferDate,
      transferType,
      dividendTerm,
    },index) => ({
      No:index+1,
      from: `${fromShareholderName} (Id: ${fromShareholderId})`,
      to: `${toShareholderName} (Id: ${toShareholderId})`,
      amount,
      numberOfShares,
      transferDate,
      transferType,
      dividendTerm,
    })
  );
  const columns: Column<TransferGridItem>[] = [
    {
      header: "No",
      field: "No",
      widthInPercent: 5,
      footer: "Total",
    },
    {
      header: "From",
      field: "from",
      widthInPercent: 20,
    },
    {
      header: "To",
      field: "to",
      widthInPercent: 20,
    },
   {
      header: "Transfer Date",
      field: "transferDate",
      widthInPercent: 12,
    },
    {
      header: "Transfer Type",
      field: "transferType",
      widthInPercent: 12,
    }, 
    {
      header: "Dividend Term",
      field: "dividendTerm",
      widthInPercent: 12,
    },
    {
      header: "Amount in Birr",
      field: "amount",
      widthInPercent: 12,
      footer: totalTransferAmount,
    },  
    {
      header: "#Shares",
      field: "numberOfShares",
      widthInPercent: 7,
      footer: totalShare,
    },
  
  
  ];
  
  return (
    <ReportContainer orientation="landscape">
      <Header title={reportConfigurations[Report.Transfers].title} />
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
          <Text>{`Transfers from`}</Text>
          <Text style={{ fontWeight: "light", marginLeft: 4 }}>{fromDate}</Text>
          <Text style={{ marginLeft: 4 }}>to</Text>
          <Text style={{ fontWeight: "light", marginLeft: 4 }}>{toDate}</Text>
        </View>
      </View>
      <Content>
        <View style={{ fontSize: 7 }}>
          <Table data={records} columns={columns} verticalRowPadding={3} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getTransfersReport = (request: Request) => (
  <TransfersReport {...request.body} />
);
