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
  shareholderId: string;
  shareholderName: string;
  registrationDate: string;
  totalPaidUpInBirr: string;
  totalSubscription: string;
}

interface Props {
  shareholders: Shareholders[];
}

const columns: Column<Shareholders>[] = [
  {
    header: "Shareholder Id",
    field: "shareholderId",
    widthInPercent: 16,
  },
  {
    header: "Shareholder Name",
    field: "shareholderName",
    widthInPercent: 20,
  },
  {
    header: "Registration Date",
    field: "registrationDate",
    widthInPercent: 20,
  },
  {
    header: "Total Subscription",
    field: "totalSubscription",
    widthInPercent: 20,
  },
  {
    header: "Total PaidUp InBirr",
    field: "totalPaidUpInBirr",
    widthInPercent: 20,
  },
];

const NewShareholdersListReport = ({ shareholders }: Props) => {
  return (
    <ReportContainer>
      <Header
        title={reportConfigurations[Report.NewShareholdersListReport].title}
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
          <Table data={shareholders} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getNewShareholderReport = (request: Request) => (
  <NewShareholdersListReport {...request.body} />
);
