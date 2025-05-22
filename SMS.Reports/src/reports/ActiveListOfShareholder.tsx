import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Request } from "express";
import { Content, Logo } from "../components";
import { Column, Table } from "../components/TableCompose";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingVertical: 20,
    display: "flex",
    justifyContent: "center",
  },
});
interface ShareholderList {
  representative: string;
  votingAmount: number;
  shareAmount: number;
  kebele: string;
  houseNo?: string;
  woreda: string;
  subcity: number;
  city: string;
  shareholderName?: string;
  shareholderID: number;
  sequence: number;
}

interface Props {
  ActiveShareholderListForGA: ShareholderList[];
  amount:number;
}

const columns: Column<ShareholderList>[] = [
  {
    header: (<Text style={{ fontFamily: "Amharic" }}>ተ.ቁ</Text>) as any,
    field: "sequence",
    widthInPercent: 4,
  },
  {
    header: (
      <Text style={{ fontFamily: "Amharic" }}>የአክሲዮን መለያ ቁጥር</Text>
    ) as any,
    field: "shareholderID",
    widthInPercent: 8,
  },
  {
    header: (<Text style={{ fontFamily: "Amharic" }}>የባለአክሲዮኑ ስም</Text>) as any,
    field: "shareholderName",
    widthInPercent: 18,
  },
  {
    header: (<Text style={{ fontFamily: "Amharic" }}>ክልል</Text>) as any,
    field: "city",
    widthInPercent: 10,
  },

  {
    header: (<Text style={{ fontFamily: "Amharic" }}>ክፍለ ከተማ</Text>) as any,
    field: "subcity",
    widthInPercent: 10,
  },
  {
    header: (<Text style={{ fontFamily: "Amharic" }}>ወረዳ</Text>) as any,
    field: "woreda",
    widthInPercent: 8,
  },
  {
    header: (<Text style={{ fontFamily: "Amharic" }}>ቀበሌ</Text>) as any,
    field: "kebele",
    widthInPercent: 8,
  },
  {
    header: (<Text style={{ fontFamily: "Amharic" }}>የቤት ቁጥር</Text>) as any,
    field: "houseNo",
    widthInPercent: 8,
  },

  {
    header: (<Text style={{ fontFamily: "Amharic" }}>የአክሲዮን ብዛት</Text>) as any,
    field: "shareAmount",
    widthInPercent: 8,
  },
  {
    header: (
      <Text style={{ fontFamily: "Amharic" }}>የሚሰጠው የደምጽ ብዛት</Text>
    ) as any,
    field: "votingAmount",
    widthInPercent: 10,
  },
  {
    header: (<Text style={{ fontFamily: "Amharic" }}>ወኪል ስም</Text>) as any,
    field: "representative",
    widthInPercent: 8,
  },
];

const ActiveShareholder = ({ ActiveShareholderListForGA,amount }: Props) => {
  const date = new Date().toLocaleDateString();

  return (
    <Page size="A4" style={styles.page} orientation={"landscape"} wrap={false}>
      <Content>
        <View style={{ fontSize: 8, display: "flex", flexDirection: "row" }}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 15,
            }}
          >
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Logo height={50} />

              <View
                style={{
                  textAlign: "center",
                  color: "#003da5",
                  fontWeight: "bold",
                  padding: 15,
                }}
              >
                <Text style={{ fontFamily: "Amharic", paddingLeft: 110 }}>
                  ብርሃን ባንከ አ.ማ
                </Text>
                <Text style={{ fontFamily: "Amharic" }}>
                  የባለአክሲዮኖች 14ኛ መደበኛ ጠቅላላ ጉባኤ ላይ የተገኙ የጉባኤ ተሳታፊዎች መመዝገቢያ ሰነድ
                </Text>
                <Text style={{ fontFamily: "Amharic", paddingLeft: 100 }}>
                  ህዳር 20 ቀን 2016 ዓ.ም
                </Text>
              </View>
            </View>

            <View style={{ fontSize: 7 }}>
              <Content>
                <View style={{ fontSize: 7 }}>
                  <Table data={ActiveShareholderListForGA} columns={columns} />
                </View>
              </Content>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: 16,
              }}
            >
              <View
                style={{
                  paddingRight: 8,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Text style={{ fontFamily: "Amharic" }}>የአስፈራሚው ስም፡</Text>
                <Text style={{paddingBottom:3}}>______________________________</Text>
              </View>
              <View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ fontFamily: "Amharic", paddingLeft: 150 }}>
                    በስብሰባዉ መጀመሪያ ላይ በጉባኤዉ በአካል የተገኙ ባለአክሲዮኖች ወይም ወኪሎች የፈረሙበት
                    መሆኑን አረጋግጣለሁ።
                  </Text>
                </View>
                <View
                  style={{
                    marginLeft: "-133",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ fontFamily: "Amharic",paddingTop:4 }}>
                    ፊርማ፡_____________________________
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ fontFamily: "Amharic", paddingLeft: 150 }}>
                    ያረጋገጠዉ ስም ፡ አቻምየለሽ አለማየሁ-የማህበሩ ፀሐፊ
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ fontFamily: "Amharic", paddingLeft: 150,paddingTop:4  }}>
                    ፊርማ፡_____________________________
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Content>
    </Page>
  );
};

export const getActiveShareholderListForGAs = (request: Request) => (
  <ActiveShareholder {...request.body} />
);