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
import { Field } from "./shareCertificate/Field";

interface EodHeader{
  isSuccess: string;
  responseCode: string;
  batchNumber: string;
  responseMessage?: string;
  postingDate:string;
  CreatedDate:string;
}
interface Details {
  amount: number;
  glAccountNumber: string;
  batchNumber: string;
  transactionType: number;
  responseMessage?: string;
  postingDate:string;
  isSuccess:string;
}
interface Props {
  fromDate: string;
  toDate: string;
  endOfDayResponse:EodHeader[];
  endOfDayDetail:Details[];
}


const columnsHeader: Column<EodHeader>[] = [
 
  {
    header: "Response Message",
    field: "responseMessage",
    widthInPercent: 20,
  },
  {
    header: "Response Code",
    field: "responseCode",
    widthInPercent: 16,
  },
  {
    header: "Batch Number",
    field: "batchNumber",
    widthInPercent: 25,
  },
  
  {
    header: "EOD Posting Date",
    field: "postingDate",
    widthInPercent: 16,
  },
  {
    header: "EOD Created Date",
    field: "CreatedDate",
    widthInPercent: 16,
  },

];

const columnsDetail: Column<Details>[] = [
  {
    header: "Response Message",
    field: "responseMessage",
    widthInPercent: 20,
  },
  {
    header: "Amount in Birr",
    field: "amount",
    widthInPercent: 12,
  },

  {
    header: "GL Account No",
    field: "glAccountNumber",
    widthInPercent: 20,
  },
  {
    header: "Txn Type",
    field: "transactionType",
    widthInPercent: 8,
  },
  {
    header: "Batch Number",
    field: "batchNumber",
    widthInPercent: 23,
  },
  {
    header: "Is Success",
    field: "isSuccess",
    widthInPercent: 7,
  },
  {
    header: "EOD Posting Date",
    field: "postingDate",
    widthInPercent: 14,
  },
];

const EndOfDayDailyReport = ({
  fromDate,
  toDate,
  endOfDayResponse,
  endOfDayDetail
}: Props) => {

  return (
    <ReportContainer>
      <Header title={reportConfigurations[Report.EndOfDaydaily].title} />
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
          <Text>{`Daily End Of Day Posting :`}</Text>
          <Text style={{ fontWeight: "light", marginLeft: 4 }}>{fromDate}</Text>
          <Text style={{ marginLeft: 4 }}>to</Text>
          <Text style={{ fontWeight: "light", marginLeft: 4 }}>{toDate}</Text>
        </View>
      </View>
      <Content>
        <View style={{ fontSize: 7 }}>
        <Table data={endOfDayResponse as any} columns={columnsHeader}>
        </Table>
        <Table data={endOfDayDetail as any} columns={columnsDetail} />
          
        </View>
      </Content>
      {/* <Content>
        <View style={{ fontSize: 7 }}>
          <Table data={endOfDayResponse as any} columns={columnsHeader} />
          {endOfDayResponse.endOfDaydaily && Object.values(endOfDayResponse.endOfDaydaily).map((daily:any) => (
            <Table  key={daily.batchNumber} data={daily} columns={columns} />
          ))}
        </View>
      </Content> */}
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getEndOfDayDaily = (request: Request) => (
  <EndOfDayDailyReport {...request.body} />
);