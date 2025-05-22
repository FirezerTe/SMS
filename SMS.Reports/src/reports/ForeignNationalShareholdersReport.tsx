
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

interface Shareholders {
  No: number;
  shareholderId: string;
  shareholderName: string;
  countryOfCitizenship: string;
  ethiopianOrgin: string;
  phoneNumber: string;
  emailAddress: string;
  totalPaidUpInBirr: string;
  totalSubscription: string;
}

interface Props {
  shareholders: Shareholders[];
  totalPaymentAmount: string;
  totalSubscription: string;
}

const ForeignShareholdersReport = ({
  shareholders,
  totalSubscription,
  totalPaymentAmount,
}: Props) => {
  const PaymentsList = shareholders.map((shareholderInfo, index) => ({
    ...shareholderInfo,
    No: index + 1,
  }));
  const columns: Column<Shareholders>[] = [
    {
      header: "No",
      field: "No",
      widthInPercent: 5,
      footer: "Total",
    },
    {
      header: "SH Id",
      field: "shareholderId",
      widthInPercent: 7,
    },
    {
      header: "Shareholder Name",
      field: "shareholderName",
      widthInPercent: 20,
    },   
    {
      header: "Citizenship",
      field: "countryOfCitizenship",
      widthInPercent: 10,
    },
    {
      header: "Ethiopian Orgin",
      field: "ethiopianOrgin",
      widthInPercent: 8,
    },
    {
      header: "Phone Number",
      field: "phoneNumber",
      widthInPercent: 12,
    },
    {
      header: "Email",
      field: "emailAddress",
      widthInPercent: 16,
    }, 
    {
      header: "Subscription",
      field: "totalSubscription",
      widthInPercent: 16,
      footer: totalSubscription,
    },
    {
      header: "Paidup",
      field: "totalPaidUpInBirr",
      widthInPercent: 16,
      footer: totalPaymentAmount,
    },
  ];
  return (
    <ReportContainer>
      <Header
        title={
          reportConfigurations[Report.ForeignNationalShareholdersReport].title
        }
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
          <Table data={PaymentsList} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getForeignNationalShareholderReport = (request: Request) => (
  <ForeignShareholdersReport {...request.body} />
);