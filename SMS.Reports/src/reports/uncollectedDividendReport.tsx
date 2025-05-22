import { Text, View } from "@react-pdf/renderer";
import {
  Column,
  Content,
  Footer,
  Header,
  ReportContainer,
  Table,
} from "../components/index";
import { Request } from "express";
import { reportConfigurations } from "./reportConfigurations";
import { Report } from "./types";

interface UncollectedDividends {
  No: Number;
  shareholderId: string;
  shareholderName: string;
  fiscalYear: string;
  amount: number;
  Tax: string;

}

interface Props {
  totalUncollected: string;
  TotalTax: string;
  uncollectedDividend: UncollectedDividends[];
}

const UncollectedDividendReport = ({ uncollectedDividend,totalUncollected,TotalTax }: Props) => {
  const uncollectedDividendList = uncollectedDividend.map((decision, index) => ({
    ...decision,
    No: index + 1,
  }));
const columns: Column<UncollectedDividends>[] = [
  {
    header: "No",
    field: "No",
    widthInPercent: 5,
    footer:"Total"
  },
  {
    header: "Shareholder Id",
    field: "shareholderId",
    widthInPercent: 15,
  },
  {
    header: "Shareholder Name",
    field: "shareholderName",
    widthInPercent: 25,
  },
  {
    header: "Fiscal Year",
    field: "fiscalYear",
    widthInPercent: 20,
  },
  {
    header: "Uncollected Dividend Amount",
    field: "amount",
    widthInPercent: 20,
    footer: totalUncollected,
  },
  {
    header: "Tax",
    field: "Tax",
    widthInPercent: 12,
    footer: TotalTax,
  },

];


  return (
    <ReportContainer>
      <Header
        title={reportConfigurations[Report.UncollectedDividendReport].title}
      />
      <Content>
        <View
          fixed
          style={{
            paddingVertical: 4,
            display: "flex",
            flexDirection: "row",
            fontSize: 12,
            marginBottom: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text>Uncollected Dividend: </Text>
            </View>
            </View>
        </View>
        <View style={{ fontSize: 7 }}>
          <Table data={uncollectedDividendList} columns={columns} />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getUncollectedDividendReport = (request: Request) => (
  <UncollectedDividendReport {...request.body} />
);
