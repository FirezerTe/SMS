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

interface AllocatedSubscription {
  shareholderID?: number;
  allocationID?: number;
  SubscriptionAllocationAmount?: number;
  expireDate?: string;
  shareholderName: string;
}

interface Props {
  shareholderId: number;
  AllShareholdersAllocatedSubscription: AllocatedSubscription[];
}
const columns: Column<AllocatedSubscription>[] = [
  {
    header: "Shareholder ID",
    field: "shareholderID",
    widthInPercent: 10,
  },
  {
    header: "Shareholder Name",
    field: "shareholderName",
    widthInPercent: 16,
  },
  {
    header: "Allocation ID",
    field: "allocationID",
    widthInPercent: 10,
  },
  {
    header: "Allocated Subscription",
    field: "SubscriptionAllocationAmount",
    widthInPercent: 15,
  },
  {
    header: "Expire Date",
    field: "expireDate",
    widthInPercent: 10,
  },
];

const ShareholderAllocatedSubscriptionsReport = ({
  shareholderId,
  AllShareholdersAllocatedSubscription,
}: Props) => {
  return (
    <ReportContainer>
      <Header
        title={
          reportConfigurations[Report.ShareholdersAllocatedSubscriptions].title
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
        >
          <View style={{ flex: 1 }}>
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text>Shareholder Id:</Text>
              <Text style={{ fontWeight: "light", marginLeft: 4 }}>
                {shareholderId}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ fontSize: 7 }}>
          <Table
            data={AllShareholdersAllocatedSubscription}
            columns={columns}
          />
        </View>
      </Content>
      <Footer></Footer>
    </ReportContainer>
  );
};

export const getShareholdersAllocatedSubscriptions = (request: Request) => (
  <ShareholderAllocatedSubscriptionsReport {...request.body} />
);