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

interface organization {
  shareholderId: number;
  shareholderName: string;
  representativeName: string;
  representativeEmail?: string;
  city: string;
  kebele: string;
  woreda: string;
  contact: string;
  sequence: number;
}

interface Props {
  organizations: string;
  organizationList: organization[];
}

const columns: Column<organization>[] = [
  {
    header: "#No",
    field: "sequence",
    widthInPercent: 4,
  },
  {
    header: "Shareholder Id",
    field: "shareholderId",
    widthInPercent: 10,
  },
  {
    header: "Shareholder Name",
    field: "shareholderName",
    widthInPercent: 20,
  },
  {
    header: "Shareholder Contact",
    field: "contact",
    widthInPercent: 12,
  },
  {
    header: "Representative Name",
    field: "representativeName",
    widthInPercent: 14,
  },

  {
    header: "Representative Email",
    field: "representativeEmail",
    widthInPercent: 14,
  },
  {
    header: "City",
    field: "city",
    widthInPercent: 10,
  },
  {
    header: "Woreda",
    field: "woreda",
    widthInPercent: 10,
  },
  {
    header: "Kebele",
    field: "kebele",
    widthInPercent: 10,
  },
];

const OrganizationReport = ({ organizationList, organizations }: Props) => {
  return (
    <ReportContainer>
      <Header title={reportConfigurations[Report.Organizations].title} />
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
          <Text style={{ fontSize: 10 }}>
            Shareholder Type: {organizations}
          </Text>
        </View>

        <View style={{ flex: 1 }}></View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text>{`List Of `}</Text>
          <Text style={{ fontWeight: "light", marginLeft: 4 }}>
            {organizations}
          </Text>
          <Text style={{ marginLeft: 4 }}>{`Report`}</Text>
        </View>
      </View>
      <Content>
        <View style={{ fontSize: 7 }}>
          <Table data={organizationList} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getOrganization = (request: Request) => (
  <OrganizationReport {...request.body} />
);