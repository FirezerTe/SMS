import { Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Request } from "express";
import { Content, Logo, ReportContainer } from "../../components";
import { Field } from "./Field";
import { Title } from "./Title";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    paddingVertical: 20,
    display: "flex",
    justifyContent: "center",
  },
});

interface Props {
  formNumber: number;
  displayNameAmharic: string;
  displayNameEnglish: string;
  totalShareCount: number;
  totalShareInBirr: number;
  shareholderPhoneNumber: string;
  shareholderId: number;
  address: {
    city: string;
    subCity: string;
    woreda: string;
    kebele: string;
    houseNumber: string;
  };
  shareParValue: number;
  paidUpShareInBirr: number;
  registrationNumber: number;
  registrationDate: number;
  placeOfRegistration: string;
  totalSubscriptionInBirr: number;
  paidUpSubscriptionInBirr: number;
  certificateNumber:number;
}

const ShareCertificate = ({
  formNumber,
  displayNameAmharic,
  displayNameEnglish,
  totalShareCount,
  totalShareInBirr,
  shareholderId,
  shareholderPhoneNumber,
  address,
  shareParValue,
  paidUpShareInBirr,
  registrationNumber,
  registrationDate,
  totalSubscriptionInBirr,
  paidUpSubscriptionInBirr,
  placeOfRegistration,
  certificateNumber
}: Props) => {
  const date = new Date().toLocaleDateString();
  return (
    <>
      <ReportContainer>
        <Content>
          <View style={{ fontSize: 10 }}>
            <View>
              <Logo height={40} />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: 50,
                marginBottom: 15,
              }}
            >
              <View style={{ flex: 1 }}></View>
              <Text style={{ fontFamily: "Amharic" }}>ቁጥር</Text>
              <Text>/SN</Text>
              <Text
                style={{
                  width: 75,
                  borderBottomWidth: 0.5,
                  borderColor: "#D3D3D3",
                }}
              > {certificateNumber}</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                paddingVertical: 12,
                fontSize: 10,
              }}
            >
              <Title />
            </View>

            <View>
              <Field
                amharicLabel={"የባለአክሲዮኑ ሙሉ ስም"}
                value={displayNameAmharic}
                isAmharicValue
              />
              <Field amharicLabel={"የባለአክሲዮኑ መለያ ቁጥር"} value={shareholderId} />
              <Field amharicLabel={"የአክሲዮን ብዛት በቁጥር"} value={totalShareCount} />
              <Field amharicLabel={"የአክሲዮን ብዛት በብር"} value={paidUpShareInBirr} />
              <Field
                labelOnly
                amharicLabel="ተራ ቁጥራቸው ከ.....................እስከ..................... ሆነው የተመዘገቡትን አና ከላይ የተጠቀሰው ብዛት እና መጠን ያላቸውን አክሲዮኖች የባለቤትነት ማረጋገጫ ሰርተፍኬት መቀበሌን አረጋግጣለሁ።"
              />
              <Field
                amharicLabel={"ስም"}
                value={displayNameAmharic}
                isAmharicValue
              />
              <Field amharicLabel={"ፊርማ"} value="" />
              <Field amharicLabel={"ቀን"} value={date} />
              <Field amharicLabel={"ስልክ"} value={shareholderPhoneNumber} />
              <Text style={{ fontFamily: "Amharic", marginVertical: 16 }}>
                ወኪል ከሆኑ የውክልና ስልጣን ማስረጃ ያቅርቡ።
              </Text>
            </View>
          </View>
          {/* </View> */}
        </Content>
      </ReportContainer>
      <Page
        size="A4"
        style={styles.page}
        orientation={"landscape"}
        wrap={false}
      >
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
                <View style={{ flex: 1 }}></View>
              </View>

              <View style={{ fontSize: 7 }}>
                <Text style={{ fontFamily: "Amharic" }}>
                  በኢትዮጵያ ህግ መሠረት ላልተወሰነ ጊዜ የተቋቋመና በአዋጅ ቁጥር 592/2000 ዓ.ም. መሠረት
                  ፈቃድ ያገኘ።
                </Text>
                <Text>
                  Incorporated for indefinite period under the law of Ethiopia &
                  licensed proclamation No 592/2008
                </Text>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ fontFamily: "Amharic" }}>ስልክ</Text>
                    <Text>/Tel +251 11 6616597/+251 11 6185722/32 </Text>
                  </View>
                  <View
                    style={{
                      paddingLeft: 4,
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Text style={{ fontFamily: "Amharic" }}> ኢ-ሜይል</Text>
                    <Text>/E-mail info@berhanbanksc.com </Text>
                  </View>
                  <View
                    style={{
                      paddingLeft: 4,
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Text style={{ fontFamily: "Amharic" }}>ፓ.ሣ.ቁ </Text>
                    <Text>/P.O.Box 387 code 1110 </Text>
                    <Text style={{ fontFamily: "Amharic" }}>አዲስ አበባ ኢትዮጵያ</Text>
                    <Text>/ ADDIS ABABA ETHIOPIA</Text>
                  </View>
                </View>

                <View
                  style={{
                    paddingVertical: 6,
                    marginTop: 10,
                    fontSize: 12,
                    position: "relative",
                  }}
                >
                  <Title />
                  <View
                    style={{
                      position: "absolute",
                      right: 0,
                      bottom: 10,
                      fontSize: 8,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flex: 1 }}></View>
                      <Text style={{ fontFamily: "Amharic" }}>ቁጥር</Text>
                      <Text>/SN</Text>
                      <Text
                        style={{
                          width: 75,
                          borderBottomWidth: 0.5,
                          borderColor: "#D3D3D3",
                        }}
                      > { certificateNumber}</Text>
                    </View>
                  </View>
                </View>
                <View>
                  <View>
                    <Field
                      amharicLabel="ይህ የምስክር ወረቀት የያዘ"
                      englishLabel="This is to certify that"
                      value={`${displayNameEnglish} (${displayNameAmharic})`}
                    >
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text>{displayNameEnglish}</Text>
                        <Text
                          style={{ fontFamily: "Amharic", marginLeft: 4 }}
                        >{`(${displayNameAmharic})`}</Text>
                      </View>
                    </Field>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <View
                      style={{ minWidth: 35, maxWidth: 35, marginVertical: 8 }}
                    >
                      <Text style={{ fontFamily: "Amharic" }}>አድራሻ፡</Text>
                      <Text>Address</Text>
                    </View>
                    <View>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                          <View style={{ width: 25 }}>
                            <Field
                              labelOnly
                              amharicLabel="ከተማ"
                              englishLabel="City"
                              value={address?.city}
                            />
                          </View>
                          <Field
                            amharicLabel="ክ/ክ"
                            englishLabel="Sub city"
                            value={`${address?.city} / ${address?.subCity}`}
                          />
                        </View>
                        <View style={{ minWidth: "50%", maxWidth: "50%" }}>
                            <Field
                          amharicLabel="ቀበሌ/ወረዳ"
                          englishLabel="Kebele/Woreda"
                          value={`${address?.kebele} / ${address?.woreda}`}
                        />
                        </View>
                      </View>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                      <Field
                            amharicLabel="የቤቁ"
                            englishLabel="House .No."
                            value={address?.houseNumber}
                          />
                           <View style={{ minWidth: "50%", maxWidth: "50%" }}>
                          <Field
                            amharicLabel="ስልክ ቁጥር"
                            englishLabel="Tel.No."
                            value={shareholderPhoneNumber}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <View style={{ minWidth: "50%", maxWidth: "50%" }}>
                      <Field
                        amharicLabel="ተራ ቁጥራቸው ከ"
                        englishLabel="Serial numbers From"
                      />
                    </View>
                    <View style={{ minWidth: "20%", maxWidth: "20%" }}>
                      <Field amharicLabel="እስከ" englishLabel="To" />
                    </View>
                    <Field
                      amharicLabel="የአንዱ አክሲዮን ዋጋ"
                      englishLabel="Par Value of each share"
                      value={shareParValue}
                    />
                     <View style={{ minWidth: "10%", maxWidth: "10%" }}>
            <Field
                      amharicLabel="የሆነ"
                      labelOnly
                    />
            </View>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <View style={{ minWidth: "50%", maxWidth: "50%" }}>
                      <Field
                        amharicLabel="የተራ አክሲዮን ብዛታቸው"
                        englishLabel="No of Ordinary Shares"
                        value={totalShareCount}
                      />
                    </View>
                    <View style={{ minWidth: 25, maxWidth: 25 }}>
                      <Field amharicLabel="የሆኑ" labelOnly />
                    </View>
                    <Field
                      amharicLabel="የተከፈለ አክሲዮን ብር"
                      englishLabel="Paid up capital Birr"
                      value={paidUpShareInBirr}
                    />
                  </View>
                  <View>
                    <Field
                      amharicLabel="ባለይዞታ መሆናቸውንና በባለ አክሲዮኖች መዝገብ መመዝገባቸውን እናረጋግጣለን።"
                      englishLabel="is owner of shares registered in shareholders' register as indicated above."
                      labelOnly
                    />
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <View style={{ minWidth: "10%", maxWidth: "10%" }}>
                      <Field
                        amharicLabel="የባንኩ"
                        englishLabel="The Bank's"
                        labelOnly
                      />
                    </View>
                    <View style={{ minWidth: "40%", maxWidth: "40%" }}>
                      <Field
                        amharicLabel="የመዝገብ ቁጥር"
                        englishLabel="Registration No"
                        value="06/2/28428/01"
                      />
                    </View>
                    <Field
                      amharicLabel="የምዝገባ ቦታ"
                      englishLabel="Registration Place"
                      value="Addis Ababa"
                    />
                    <View style={{ minWidth: "20%", maxWidth: "20%" }}>
                    <Field
                     amharicLabel="የምዝገባ ቀን"
                     englishLabel="Registration Date"
                    >
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text>June 25, 2009</Text>
                        <Text
                          style={{ fontFamily: "Amharic", marginLeft: 4 }}
                        >(ሰኔ 18 ቀን 2001 ዓ.ም)</Text>
                      </View>
                    </Field>
                  </View>
                  </View>
                  <View>
                    <Field
                      amharicLabel="ይህ ሰርተፍኬት በተሰጠበት ቀን የባንኩ፡"
                      englishLabel="As of the issuance date of this certificate, the Bank has:"
                      labelOnly
                    />
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <View style={{ minWidth: "50%", maxWidth: "50%" }}>
                      <Field
                        amharicLabel="ቃል የተገባ ካፒታል ብር"
                        englishLabel="Subscribed Amount of Birr"
                        value={totalSubscriptionInBirr}
                      />
                    </View>
                    <Field
                      amharicLabel="የተከፈለ ካፒታል ብር"
                      englishLabel="Paid up capital of Birr"
                      value={totalShareInBirr}
                    />
                            <View style={{ minWidth: "10%", maxWidth: "10%" }}>
                  <Field
                        amharicLabel="ናቸው፡፡"
                        labelOnly
                        
                      />
                  </View>
                  </View>

                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <View style={{ minWidth: "50%", maxWidth: "50%" }}>
                      <Field
                        amharicLabel="የተሰጠበት ቀን"
                        englishLabel="Issued on"
                        labelOnly
                        
                      />
                         <Field
                        value={date}
                      />
                      <View
                        style={{
                          height: 18,
                          borderBottomStyle: "dotted",
                          borderBottomWidth: 0.1,
                          fontWeight: "light",
                          marginLeft: "3",
                          borderBottomColor: "#D3D3D3",
                        }}
                      >
                      </View>
                    </View>
                    <View>
                      <Field
                        amharicLabel="የባንኩ ፕሬዝዳንት"
                        englishLabel="President"
                        labelOnly
                      />
                      <View
                        style={{
                          height: 18,
                          borderBottomStyle: "dotted",
                          borderBottomWidth: 0.1,
                          fontWeight: "light",
                          marginLeft: "4",
                          borderBottomColor: "#D3D3D3",
                        }}
                      ></View>
                    </View>
                    <View>
                      <Field
                        amharicLabel="የዳይሬክተሮች ቦርድ ሰብሳቢ"
                        englishLabel="Chairperson, Board of Directors"
                        labelOnly
                      />
                      <View
                        style={{
                          height: 18,
                          borderBottomStyle: "dotted",
                          borderBottomWidth: 0.1,
                          fontWeight: "light",
                          marginLeft: "4",
                          borderBottomColor: "#D3D3D3",
                        }}
                      ></View>
                    </View>
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
                      <Text style={{ fontFamily: "Amharic" }}>ማሳሰቢያ፥/</Text>
                      <Text>Note:</Text>
                    </View>
                    <View>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ fontFamily: "Amharic" }}>
                          እነዚህ አክሲዮኖች አግባብነት ባለው ሕግ መሰረት ሊተላለፉ ይችላሉ።
                        </Text>
                        <Text style={{ paddingLeft: 2 }}>
                          / These shares may be transferred in accordance with
                          the relevant lows.
                        </Text>
                      </View>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ fontFamily: "Amharic" }}>
                          ይህ ሰርተፍኬት ከባንኩ የማረጋገጫ ደብዳቤ ውጭ ለብድር ዋስትናነት ሊያገለግል
                          አይችልም።
                        </Text>
                        <Text style={{ paddingLeft: 2 }}>
                          / This certificate is not valid to be pledged as
                          collateral without the Bank's confirmation letter.
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Content>
      </Page>
    </>
  );
};

export const getShareCertificate = (request: Request) => (
  <ShareCertificate {...request.body} />
);