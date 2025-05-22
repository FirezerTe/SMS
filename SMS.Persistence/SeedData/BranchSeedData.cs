using SMS.Domain;

namespace SMS.Persistence.SeedData;

public static class BranchSeedData
{
    public static async Task SeedAsync(SMSDbContext dbContext)
    {
        if (!dbContext.Branches.Any())
        {
            await dbContext.Branches.AddRangeAsync(Branches);
        }
    }
    public static List<Branch> Branches => new List<Branch>()
    {
            new Branch () {BranchName="HEAD OFFICE",BranchCode="999",DistrictId=01,BranchShareGL="14-01-091-214-2140019", IsHeadOffice=true},
            new Branch () {BranchName="INTERNATIONAL BANKING DEPARTMENT",BranchCode="998",DistrictId=01},
            new Branch () {BranchName="BOLE BRANCH",BranchCode="001",DistrictId=01},
            new Branch () {BranchName="HAYAHULET MAZORIA BRANCH",BranchCode="002",DistrictId=01},


            new Branch () {BranchName="AMEDE GEBEYA BRANCH",BranchCode="003",DistrictId=02},
            new Branch () {BranchName="KALITY BRANCH",BranchCode="004",DistrictId=02},
            new Branch () {BranchName="GENET BRANCH",BranchCode="005",DistrictId=02},
            new Branch () {BranchName="HAWASSA BRANCH",BranchCode="006",DistrictId=03},

            new Branch () {BranchName="BAHRDAR BRANCH",BranchCode="007",DistrictId=04},
            new Branch () {BranchName="ADAMA BRANCH",BranchCode="008",DistrictId=05},
            new Branch () {BranchName="LEGEHAR BRANCH",BranchCode="009",DistrictId=02},
            new Branch () {BranchName="HOSSANA BRANCH",BranchCode="010",DistrictId=03},

            new Branch () {BranchName="MEGENAGNA BRANCH",BranchCode="011",DistrictId=01},
            new Branch () {BranchName="GONDER BRANCH",BranchCode="012",DistrictId=04},
            new Branch () {BranchName="DIR TERA BRANCH",BranchCode="013",DistrictId=02},
            new Branch () {BranchName="DESSIE BRANCH",BranchCode="014",DistrictId=04},

            new Branch () {BranchName="Mekelle Branch",BranchCode="015",DistrictId=04},
            new Branch () {BranchName="MESHUALKIA BRANCH",BranchCode="016",DistrictId=01},
            new Branch () {BranchName="Shashemene Branch",BranchCode="017",DistrictId=03},
            new Branch () {BranchName="BISHOFTU BRANCH",BranchCode="018",DistrictId=05},

            new Branch () {BranchName="ALEMGENA BRANCH",BranchCode="019",DistrictId=02},
            new Branch () {BranchName="JIMMA BRANCH",BranchCode="020",DistrictId=05},
            new Branch () {BranchName="TEKLEHAIMANOT BRANCH",BranchCode="021",DistrictId=02},
            new Branch () {BranchName="KERA BRANCH",BranchCode="022",DistrictId=02},

            new Branch () {BranchName="SARIS GUMURUK BRANCH",BranchCode="023",DistrictId=02},
            new Branch () {BranchName="WOLAITA BRANCH",BranchCode="024",DistrictId=03},
            new Branch () {BranchName="ARBAMINCH BRANCH",BranchCode="025",DistrictId=03},
            new Branch () {BranchName="WOLOSEFER BRANCH",BranchCode="026",DistrictId=01},

            new Branch () {BranchName="MERI BRANCH",BranchCode="027",DistrictId=01},
            new Branch () {BranchName="OLOMPIA BRANCH",BranchCode="028",DistrictId=01},
            new Branch () {BranchName="MIZAN TEFERI BRANCH",BranchCode="029",DistrictId=05},
            new Branch () {BranchName="DEBRE MARKOS BRANCH",BranchCode="030",DistrictId=04},

            new Branch () {BranchName="SHIRE ENDASILASSIE BRANCH",BranchCode="031",DistrictId=04},
            new Branch () {BranchName="MESALEMIA BRANCH",BranchCode="032",DistrictId=02},
            new Branch () {BranchName="JEMO BRANCH",BranchCode="033",DistrictId=02},
            new Branch () {BranchName="DIRE DAWA BRANCH",BranchCode="034",DistrictId=04},

            new Branch () {BranchName="GERJI MEBRAT HAIL BRANCH",BranchCode="035",DistrictId=01},
            new Branch () {BranchName="LAFITO BRANCH",BranchCode="036",DistrictId=02},
            new Branch () {BranchName="BOLE MEDHANIALEM BRANCH",BranchCode="037",DistrictId=01},
            new Branch () {BranchName="BETHEL BRANCH",BranchCode="039",DistrictId=02},

            new Branch () {BranchName="KOTEBE BRANCH",BranchCode="042",DistrictId=01},
            new Branch () {BranchName="ADEY ABEBA BRANCH",BranchCode="043",DistrictId=02},
            new Branch () {BranchName="MESKEL FLOWER BRANCH",BranchCode="046",DistrictId=01},
            new Branch () {BranchName="AYER TENA GIRAR BRANCH",BranchCode="045",DistrictId=02},

            new Branch () {BranchName="WELETE BRANCH",BranchCode="047",DistrictId=02},
            new Branch () {BranchName="NEKEMTE BRANCH",BranchCode="038",DistrictId=05},
            new Branch () {BranchName="GULLELE BRANCH",BranchCode="052",DistrictId=02},
            new Branch () {BranchName="LIDETA",BranchCode="056",DistrictId=02},

            new Branch () {BranchName="KIDIST MARIAM BRANCH",BranchCode="055",DistrictId=01},
            new Branch () {BranchName="PIASSA BRANCH",BranchCode="057",DistrictId=02},
            new Branch () {BranchName="SIDIST KILO BRANCH",BranchCode="058",DistrictId=01},
            new Branch () {BranchName="BELAY ZELEKE BRANCH",BranchCode="059",DistrictId=04},

            new Branch () {BranchName="BALDERAS BRANCH",BranchCode="060",DistrictId=01},
            new Branch () {BranchName="AUTOBIS TERRA BRANCH",BranchCode="061",DistrictId=02},
            new Branch () {BranchName="DUKEM BRANCH",BranchCode="040",DistrictId=05},
            new Branch () {BranchName="AMBO BRANCH",BranchCode="041",DistrictId=05},

            new Branch () {BranchName="SHASHEMENE ARADA BRANCH",BranchCode="044",DistrictId=03},
            new Branch () {BranchName="WOLISO BRANCH",BranchCode="048",DistrictId=05},
            new Branch () {BranchName="EMPEROR TEWODROS BRANCH",BranchCode="049",DistrictId=04},
            new Branch () {BranchName="ASSOSA BRANCH",BranchCode="050",DistrictId=05},

            new Branch () {BranchName="ARAB SEFER BRANCH",BranchCode="051",DistrictId=01},
            new Branch () {BranchName="GAMBELLA BRANCH",BranchCode="053",DistrictId=05},
            new Branch () {BranchName="HUMERA BRANCH",BranchCode="054",DistrictId=04},
            new Branch () {BranchName="GERJI BRANCH",BranchCode="062",DistrictId=01},

            new Branch () {BranchName="BOLE MICHEAL BRANCH",BranchCode="063",DistrictId=01},
            new Branch () {BranchName="KIRKOS BRANCH",BranchCode="064",DistrictId=01},
            new Branch () {BranchName="MEHAL WOLLOSEFER BRANCH",BranchCode="065",DistrictId=01},
            new Branch () {BranchName="AKAKI BRANCH",BranchCode="066",DistrictId=02},

            new Branch () {BranchName="HAWASSA MENAAHERIA BRANCH",BranchCode="067",DistrictId=03},
            new Branch () {BranchName="GISHE ABAY BRANCH",BranchCode="068",DistrictId=04},
            new Branch () {BranchName="ADAMA ARADA BRANCH",BranchCode="069",DistrictId=05},
            new Branch () {BranchName="ADIHAKE BRANCH",BranchCode="070",DistrictId=04},

            new Branch () {BranchName="JIGJIGA BRANCH",BranchCode="071",DistrictId=04},
            new Branch () {BranchName="TORBEN GERBE BRANCH",BranchCode="072",DistrictId=05},
            new Branch () {BranchName="GOTERA BRANCH",BranchCode="073",DistrictId=02},
            new Branch () {BranchName="DEBRE BERHAN BRANCH",BranchCode="074",DistrictId=04},

            new Branch () {BranchName="KEBENA BRANCH",BranchCode="075",DistrictId=01},
            new Branch () {BranchName="GOJAM BERENDA BRANCH",BranchCode="076",DistrictId=02},
            new Branch () {BranchName="YERER BER BRANCH",BranchCode="077",DistrictId=01},
            new Branch () {BranchName="SEBETA BRANCH",BranchCode="078",DistrictId=05},

            new Branch () {BranchName="ENKULAL FABRICA BRANCH",BranchCode="079",DistrictId=02},
            new Branch () {BranchName="HANNA MARIAM BRANCH",BranchCode="080",DistrictId=02},
            new Branch () {BranchName="DEMBIDOLLO BRANCH",BranchCode="081",DistrictId=05},
            new Branch () {BranchName="GURD SHOLA BRANCH",BranchCode="082",DistrictId=01},

            new Branch () {BranchName="SHIROMEDA BRANCH",BranchCode="083",DistrictId=01},
            new Branch () {BranchName="LEBU BRANCH",BranchCode="084",DistrictId=02},
            new Branch () {BranchName="SHINSHICHO BRANCH",BranchCode="085",DistrictId=03},
            new Branch () {BranchName="ASSELA BRANCH",BranchCode="086",DistrictId=05},

            new Branch () {BranchName="GEFERSA NONO BRANCH",BranchCode="087",DistrictId=02},
            new Branch () {BranchName="MEHAL ADAMA BRANCH",BranchCode="088",DistrictId=05},
            new Branch () {BranchName="SEMIT CONDOMINIUM BRANCH",BranchCode="089",DistrictId=01},
            new Branch () {BranchName="SHASHEMENE AWASHO BRANCH",BranchCode="090",DistrictId=03},

            new Branch () {BranchName="AIR PORT SUB BRANCH",BranchCode="091",DistrictId=01},
            new Branch () {BranchName="ADDISU GEBEYA",BranchCode="092",DistrictId=02},
            new Branch () {BranchName="BOLE BULBULA",BranchCode="093",DistrictId=01},
            new Branch () {BranchName="SHALA SUB BRANCH",BranchCode="094",DistrictId=02},

            new Branch () {BranchName="BENSSA DAYE BRANCH",BranchCode="095",DistrictId=03},
            new Branch () {BranchName="OLD AIR PORT BRANCH",BranchCode="097",DistrictId=02},
            new Branch () {BranchName="SEFERE SELAM BRANCH",BranchCode="096",DistrictId=02},
            new Branch () {BranchName="DURAME BRANCH",BranchCode="098",DistrictId=03},

            new Branch () {BranchName="FURRY BRANCH",BranchCode="099",DistrictId=02},
            new Branch () {BranchName="WOSSEN BRANCH",BranchCode="100",DistrictId=01},
            new Branch () {BranchName="JIMMA ABA JIFFAR BRANCH",BranchCode="101",DistrictId=05},
            new Branch () {BranchName="HALABA KULITO BRANCH",BranchCode="102",DistrictId=03},

            new Branch () {BranchName="WOLDIA BRANCH",BranchCode="103",DistrictId=04},
            new Branch () {BranchName="SIM BRANCH",BranchCode="104",DistrictId=02},
            new Branch () {BranchName="WORLD VISION BRANCH",BranchCode="105",DistrictId=01},
            new Branch () {BranchName="ADIGRAT BRANCH",BranchCode="106",DistrictId=04},

            new Branch () {BranchName="ADWA BRANCH",BranchCode="107",DistrictId=04},
            new Branch () {BranchName="AXUM BRANCH",BranchCode="108",DistrictId=04},
            new Branch () {BranchName="HIWOT BRANCH",BranchCode="109",DistrictId=02},
            new Branch () {BranchName="WUKRO BRANCH",BranchCode="110",DistrictId=04},

            new Branch () {BranchName="ALAMATA BRANCH",BranchCode="111",DistrictId=04},
            new Branch () {BranchName="TOSSA BRANCH",BranchCode="112",DistrictId=04},
            new Branch () {BranchName="AYAT BRANCH",BranchCode="113",DistrictId=01},
            new Branch () {BranchName="HAYAHULET GEBRIEL BRANCH",BranchCode="114",DistrictId=01},
            new Branch () {BranchName="BERECHA-ADAMA BRANCH",BranchCode="115",DistrictId=05},


            new Branch () {BranchName="SARBET BRANCH",BranchCode="116",DistrictId=02},
            new Branch () {BranchName="HABTE GEORGIES BRANCH",BranchCode="117",DistrictId=02},
            new Branch () {BranchName="ALETA WONDO BRANCH",BranchCode="118",DistrictId=03},

            new Branch () {BranchName="MODJO BRANCH",BranchCode="120",DistrictId=05},
            new Branch () {BranchName="SHONE BRANCH",BranchCode="119",DistrictId=03},
            new Branch () {BranchName="BODITI BRANCH",BranchCode="121",DistrictId=03},
            new Branch () {BranchName="LEM MEGENAGNA BRANCH",BranchCode="122",DistrictId=01},

            new Branch () {BranchName="KOMBOLCHA BRANCH",BranchCode="123",DistrictId=04},
            new Branch () {BranchName="WUHA LIMAT BRANCH",BranchCode="124",DistrictId=01},
            new Branch () {BranchName="MEKI BRANCH",BranchCode="125",DistrictId=05},
            new Branch () {BranchName="DIRE DAWA SABIAN BRANCH",BranchCode="126",DistrictId=04},

            new Branch () {BranchName="URAEL BRANCH",BranchCode="127",DistrictId=01},
            new Branch () {BranchName="TANA BRANCH",BranchCode="128",DistrictId=04},
            new Branch () {BranchName="BUTAJIRA BRANCH",BranchCode="129",DistrictId=03},
            new Branch () {BranchName="LOGIA SEMERA BRANCH",BranchCode="130",DistrictId=04},

            new Branch () {BranchName="GORO FLINT STONE BRANCH",BranchCode="131",DistrictId=01},
            new Branch () {BranchName="BEKLO BET BRANCH",BranchCode="132",DistrictId=02},
            new Branch () {BranchName="GIMBICHU BRANCH",BranchCode="133",DistrictId=03},
            new Branch () {BranchName="GOMBORA BRANCH",BranchCode="134",DistrictId=03},

            new Branch () {BranchName="SAWULA BRANCH",BranchCode="135",DistrictId=03},
            new Branch () {BranchName="JINKA BRANCH",BranchCode="136",DistrictId=03},
            new Branch () {BranchName="MEKANISSA BRANCH",BranchCode="137",DistrictId=02},
            new Branch () {BranchName="BATU BRANCH",BranchCode="139",DistrictId=03},

            new Branch () {BranchName="SULULTA BRANCH",BranchCode="138",DistrictId=05},
            new Branch () {BranchName="DAWURO BRANCH",BranchCode="140",DistrictId=03},
            new Branch () {BranchName="HARAR BRANCH",BranchCode="141",DistrictId=04},
            new Branch () {BranchName="HOLETA BRANCH",BranchCode="142",DistrictId=05},

            new Branch () {BranchName="FITCHE BRANCH",BranchCode="143",DistrictId=05},
            new Branch () {BranchName="BURAYU BRANCH",BranchCode="144",DistrictId=05},
            new Branch () {BranchName="KARA-ALO BRANCH",BranchCode="145",DistrictId=01},
            new Branch () {BranchName="GEBRE GURACHA BRANCH",BranchCode="146",DistrictId=05},

            new Branch () {BranchName="CINIMA RAS BRANCH",BranchCode="149",DistrictId=02},
            new Branch () {BranchName="WOLKITIE BRANCH",BranchCode="147",DistrictId=05},
            new Branch () {BranchName="BEKOJI BRANCH",BranchCode="148",DistrictId=03},
            new Branch () {BranchName="BESHALE BRANCH",BranchCode="150",DistrictId=01},

            new Branch () {BranchName="CMC-MICHEAL BRANCH",BranchCode="151",DistrictId=01},
            new Branch () {BranchName="YEKA ABADO BRANCH",BranchCode="152",DistrictId=01},
            new Branch () {BranchName="IMPERIAL BRANCH",BranchCode="153",DistrictId=01},
            new Branch () {BranchName="AREKA BRANCH",BranchCode="154",DistrictId=03},

            new Branch () {BranchName="TULU DIMITU BRANCH",BranchCode="155",DistrictId=02},
            new Branch () {BranchName="ADDI-HAWSI BRANCH",BranchCode="156",DistrictId=04},
            new Branch () {BranchName="GIMBI BRANCH",BranchCode="157",DistrictId=05},
            new Branch () {BranchName="NEDJO BRANCH",BranchCode="158",DistrictId=05},

            new Branch () {BranchName="HADERO BRANCH",BranchCode="159",DistrictId=03},
            new Branch () {BranchName="BONGA BRANCH",BranchCode="160",DistrictId=05},
            new Branch () {BranchName="OLYMPIA BRANCH",BranchCode="161",DistrictId=01},
            new Branch () {BranchName="TEPPI BRANCH",BranchCode="162",DistrictId=05},

            new Branch () {BranchName="BEDELE BRANCH",BranchCode="163",DistrictId=05},
            new Branch () {BranchName="METTU BRANCH",BranchCode="164",DistrictId=05},
            new Branch () {BranchName="ABAY-MADO BRANCH",BranchCode="165",DistrictId=04},
            new Branch () {BranchName="DILLA BRANCH",BranchCode="166",DistrictId=03},

            new Branch () {BranchName="MEHAL SUMMIT BRANCH",BranchCode="168",DistrictId=01},
            new Branch () {BranchName="WONDO-GENET BRANCH",BranchCode="169",DistrictId=03},
            new Branch () {BranchName="ARSI-NEGELE BRANCH",BranchCode="167",DistrictId=03},
            new Branch () {BranchName="BULE-HORA BRANCH",BranchCode="170",DistrictId=03},

            new Branch () {BranchName="CHIRO BRANCH",BranchCode="171",DistrictId=04},
            new Branch () {BranchName="ENDERASSIE BRANCH",BranchCode="172",DistrictId=01},
            new Branch () {BranchName="MIERAB MERKATO BRANCH",BranchCode="173",DistrictId=02},
            new Branch () {BranchName="GEJA SEFER  BRANCH",BranchCode="174",DistrictId=02},

            new Branch () {BranchName="MERKATO HUNGNAW MERA BRANCH",BranchCode="175",DistrictId=02},
            new Branch () {BranchName="MEKELLE HAWZEN ADEBABAY BRANCH",BranchCode="176",DistrictId=04},
            new Branch () {BranchName="BULBULA-MARIAM MAZORIA BRANCH",BranchCode="177",DistrictId=01},
            new Branch () {BranchName="NIFAS SILK BRANCH",BranchCode="178",DistrictId=02},

            new Branch () {BranchName="MEGENAGNA ADEBABAY BRANCH",BranchCode="179",DistrictId=01},
            new Branch () {BranchName="BALE ROBE BRANCH",BranchCode="180",DistrictId=01},
            new Branch () {BranchName="GINIR BRANCH",BranchCode="181",DistrictId=01},
            new Branch () {BranchName="METEHARA BRANCH",BranchCode="182",DistrictId=01},

            new Branch () {BranchName="MENDI BRANCH",BranchCode="183",DistrictId=05},
            new Branch () {BranchName="AYAT ZONE 3 BRANCH",BranchCode="184",DistrictId=01},
            new Branch () {BranchName="LAMBERET BERANCH",BranchCode="185",DistrictId=01},
            new Branch () {BranchName="ADAMA BOLE BRANCH",BranchCode="187",DistrictId=05},

            new Branch () {BranchName="SHAKISO BRANCH",BranchCode="186",DistrictId=03},
            new Branch () {BranchName="ATLAS BRANCH",BranchCode="188",DistrictId=01},
            new Branch () {BranchName="FERENSAY-GURARA BRANCH",BranchCode="189",DistrictId=01},
            new Branch () {BranchName="CHANCHO BRANCH",BranchCode="190",DistrictId=05},

            new Branch () {BranchName="MEKANISSA KORE BRANCH",BranchCode="197",DistrictId=02},
            new Branch () {BranchName="SIGNAL BRANCH",BranchCode="191",DistrictId=01},
            new Branch () {BranchName="ALULA ABA NEGA BRANCH",BranchCode="192",DistrictId=04},
            new Branch () {BranchName="BOLE ARABSA BRANCH",BranchCode="193",DistrictId=01},

            new Branch () {BranchName="BISRATE GEBRIEL BRANCH",BranchCode="194",DistrictId=02},
            new Branch () {BranchName="KASANCHIS BRANCH",BranchCode="196",DistrictId=01},
            new Branch () {BranchName="KOBO BRANCH",BranchCode="195",DistrictId=04},
            new Branch () {BranchName="ANGER-GUTE BRANCH",BranchCode="198",DistrictId=05},

            new Branch () {BranchName="AYER TENA ADEBABAY BRANCH",BranchCode="199",DistrictId=02},
            new Branch () {BranchName="AYAT-72",BranchCode="200",DistrictId=01},
            new Branch () {BranchName="MERKATO SHERA TERA",BranchCode="201",DistrictId=02},
            new Branch () {BranchName="SHOA ROBIT BRANCH",BranchCode="202",DistrictId=04},

            new Branch () {BranchName="HOSSAENA MOBIL BRANCH",BranchCode="203",DistrictId=03},
            new Branch () {BranchName="HAILE GARMENT BRANCH",BranchCode="204",DistrictId=02},
            new Branch () {BranchName="HIRENA BRANCH",BranchCode="205",DistrictId=04},
            new Branch () {BranchName="DEBRE TABOR BRANCH",BranchCode="206",DistrictId=04},

            new Branch () {BranchName="BAKO BRANCH",BranchCode="207",DistrictId=05},
            new Branch () {BranchName="JIGJIGA KALI BRANCH",BranchCode="208",DistrictId=04},
            new Branch () {BranchName="LEBU MEBERAT HAIL BRANCH",BranchCode="209",DistrictId=02},
            new Branch () {BranchName="Dollo Ado BRANCH",BranchCode="210",DistrictId=04},

            new Branch () {BranchName="KOLFE ATENA-TERA",BranchCode="211",DistrictId=02},
            new Branch () {BranchName="YESHI DEBELE BRANCH",BranchCode="212",DistrictId=02},
            new Branch () {BranchName="ALEM BANK BRANCH",BranchCode="213",DistrictId=02},
            new Branch () {BranchName="ARBA MINCH SECHA BRANCH",BranchCode="215",DistrictId=03},

            new Branch () {BranchName="DAMBOYA BRANCH",BranchCode="214",DistrictId=03},
            new Branch () {BranchName="GIDOLE BRANCH",BranchCode="216",DistrictId=03},
            new Branch () {BranchName="NEGELE BRANCH",BranchCode="217",DistrictId=03},
            new Branch () {BranchName="SHAMBU BRANCH",BranchCode="219",DistrictId=05},// misplaced was 
                   
            new Branch () {BranchName="SIBU-SIRE BRANCH",BranchCode="218",DistrictId=05},
            new Branch () {BranchName="HAILE GEBRESELASSIE HIGHWAY BRANCH",BranchCode="220",DistrictId=01},
            new Branch () {BranchName="MOYALE BRANCH",BranchCode="221",DistrictId=04},
            new Branch () {BranchName="CHENCHA BRANCH",BranchCode="223",DistrictId=03},

            new Branch () {BranchName="ADAMA-RAS BRANCH",BranchCode="222",DistrictId=05},
            new Branch () {BranchName="MEXICO BRANCH",BranchCode="224",DistrictId=02},
            new Branch () {BranchName="BUIE BRANCH",BranchCode="225",DistrictId=03},
            new Branch () {BranchName="GELAN CONDOMINIUM BRANCH",BranchCode="226",DistrictId=02},


            new Branch () {BranchName="GORO BRANCH",BranchCode="227",DistrictId=01},
            new Branch () {BranchName="SUMMIT SAFARI BRANCH",BranchCode="228",DistrictId=01},
            new Branch () {BranchName="LIDETA FIRD BET BRANCH",BranchCode="231",DistrictId=02},
            new Branch () {BranchName="COLONEL BEZABIH PETROS ADEBABAY",BranchCode="229",DistrictId=03},

            new Branch () {BranchName="ANFO BRANCH",BranchCode="230",DistrictId=02},
            new Branch () {BranchName="GUDER BRANCH",BranchCode="232",DistrictId=05},

            new Branch () {BranchName="SEKORU",BranchCode="236",DistrictId=05},
            new Branch () {BranchName="MEKANISA ABO  Branch",BranchCode="235",DistrictId=02},
            new Branch () {BranchName="SODO MENAHARIA",BranchCode="233",DistrictId=03},
            new Branch () {BranchName="SIDAMO TERA BRANCH",BranchCode="234",DistrictId=02},
            new Branch () {BranchName="YIRGALEM BRANCH",BranchCode="238",DistrictId=03},
            new Branch () {BranchName="WERETA Branch",BranchCode="234",DistrictId=04},
            new Branch () {BranchName="DOYOGENA BRANCH",BranchCode="239",DistrictId=03},
            new Branch () {BranchName="MERSA BRANCH",BranchCode="240",DistrictId=04},
            new Branch () {BranchName="Bulbula 93 Mazorya",BranchCode="241",DistrictId=01},
            new Branch () {BranchName="BISHOFTU TOURIST BRANCH",BranchCode="242",DistrictId=05},
            new Branch () {BranchName="ADAMA BOKU BRANCH ",BranchCode="243",DistrictId=05},

             new Branch () {BranchName="JEMO MICHAEL BRANCH",BranchCode="244",DistrictId=02},
             new Branch () {BranchName="GINCHI BRANCH",BranchCode="245",DistrictId=05},
             new Branch () {BranchName="METTI BRANCH",BranchCode="246",DistrictId=05},
             new Branch () {BranchName="MEHAL GERJI BRANCH",BranchCode="249",DistrictId=01},

             new Branch () {BranchName="INJIBARA BRANCH",BranchCode="251",DistrictId=04},
             new Branch () {BranchName="AKAKI ALEM BANK BRANCH",BranchCode="248",DistrictId=02},
             new Branch () {BranchName="ARAT KILO BRANCH",BranchCode="247",DistrictId=01},
             new Branch () {BranchName="Sebategna Branch",BranchCode="250",DistrictId=02},

             new Branch () {BranchName="DANGLA BRANCH",BranchCode="252",DistrictId=04},
             new Branch () {BranchName="ADAMA BOSSET",BranchCode="253",DistrictId=01},
             new Branch () {BranchName="Wolita Sodo Issue Center",BranchCode="997",DistrictId=03},
             new Branch () {BranchName="KERA GOFA MAZORYA BRANCH",BranchCode="254",DistrictId=02},

             new Branch () {BranchName=" HAWASSA ATOTE BRANCH ",BranchCode="255",DistrictId=03},
             new Branch () {BranchName="LEGETAFO BRANCH",BranchCode="256",DistrictId=04},
             new Branch () {BranchName="MEHAL HAYAHULET BRANCH",BranchCode="257",DistrictId=01},
             new Branch () {BranchName="ALETA CHUKO BRANCH",BranchCode="259",DistrictId=03},

             new Branch () {BranchName="GERJIUNITY BRANCH ",BranchCode="258",DistrictId=01},
             new Branch () {BranchName="HAYAHULET ADDIS HIWOT BRANCH",BranchCode="260",DistrictId=01},
             new Branch () {BranchName="ARERTI BRANCH",BranchCode="262",DistrictId=04},
             new Branch () {BranchName="JEMO 2 BRANCH",BranchCode="261",DistrictId=02},
             new Branch () {BranchName="ALFA BRANCH",BranchCode="263",DistrictId=02},

             new Branch () {BranchName="BOLE-HAYARAT",BranchCode="264",DistrictId=01},
             new Branch () {BranchName="GOFAADEBABAY BRANCH",BranchCode="266",DistrictId=02},
             new Branch () {BranchName="SUMMIT 72 ",BranchCode="265",DistrictId=01},
             new Branch () {BranchName="SEMIEN HOTEL BRANCH",BranchCode="267",DistrictId=02},

             new Branch () {BranchName="ADEY-ABEBA STADIUM BRANCH",BranchCode="268",DistrictId=01},
             new Branch () {BranchName="SHANTO BRANCH",BranchCode="270",DistrictId=03},
             new Branch () {BranchName="DAGMAWI MENELIK BRANCH",BranchCode="269",DistrictId=04},
             new Branch () {BranchName="GUNUNO BRANCH",BranchCode="272",DistrictId=03},

             new Branch () {BranchName="GESUBA BRANCH",BranchCode="273",DistrictId=03},
             new Branch () {BranchName="FINOTE SELAM BRANCH",BranchCode="274",DistrictId=04},
             new Branch () {BranchName="KURKURA BRANCH",BranchCode="275",DistrictId=05},
             new Branch () {BranchName="KOTEBE COLLEGE BRANCH",BranchCode="277",DistrictId=01},
             new Branch () {BranchName="DIMTU BRANCH",BranchCode="271",DistrictId=03},

             new Branch () {BranchName="GARAGODO BRANCH",BranchCode="276",DistrictId=03},
             new Branch () {BranchName="BELE AWASSA BRANCH",BranchCode="281",DistrictId=03},
             new Branch () {BranchName="BIRBIR BRANCH",BranchCode="279",DistrictId=03},
             new Branch () {BranchName="HUMBO BRANCH",BranchCode="278",DistrictId=03},

             new Branch () {BranchName="BEKLOSEGNO BRANCH",BranchCode="280",DistrictId=03},
             new Branch () {BranchName="BURIE BRANCH",BranchCode="284",DistrictId=04},
             new Branch () {BranchName="BABILLE BRANCH",BranchCode="282",DistrictId=04},
             new Branch () {BranchName="CHAGNI BRANCH",BranchCode="283",DistrictId=04},

             new Branch () {BranchName="AGARO BRANCH",BranchCode="285",DistrictId=05},
             new Branch () {BranchName="MIZANAMAN BRAMCH",BranchCode="286",DistrictId=05},
             new Branch () {BranchName=" SEBARA BABUR BRANCH",BranchCode="287",DistrictId=02},
             new Branch () {BranchName="GONDAR MARAKI BRANCH",BranchCode="288",DistrictId=04},

             new Branch () {BranchName="BICHENA BRANCH",BranchCode="289",DistrictId=04},
             new Branch () {BranchName="SHEGOLE BRANCH",BranchCode="291",DistrictId=02},
             new Branch () {BranchName="QETTEERRO BRANCH",BranchCode="290",DistrictId=05},
             new Branch () {BranchName="SHENO BRANCH ",BranchCode="292",DistrictId=07},

             new Branch () {BranchName="SAGURE BRANCH",BranchCode="293",DistrictId=01},
             new Branch () {BranchName="ITEYA BRANCH",BranchCode="294",DistrictId=01},
             new Branch () {BranchName="SHAFFETA BRANCH",BranchCode="295",DistrictId=01},
             new Branch () {BranchName="AWASH SEBAT KILO BRANCH",BranchCode="296",DistrictId=01},

             new Branch () {BranchName="ATSE-ZERAYAKOB BRANCH",BranchCode="297",DistrictId=01},
             new Branch () {BranchName="SHOLLAGEBEYA BRANCH",BranchCode="298",DistrictId=07},
             new Branch () {BranchName="GEFERSA GUJE BRANCH",BranchCode="299",DistrictId=06},
             new Branch () {BranchName="LEKU BRANCH",BranchCode="300",DistrictId=03},

             new Branch () {BranchName="MELOKOZA BRANCH",BranchCode="301",DistrictId=03},
             new Branch () {BranchName="HOMECHO BRANCH",BranchCode="302",DistrictId=03},
             new Branch () {BranchName="LEKA BRANCH",BranchCode="303",DistrictId=01},
             new Branch () {BranchName="DARAKEBADO BRANCH",BranchCode="305",DistrictId=03},

             new Branch () {BranchName="DODOLA BRANCH",BranchCode="306",DistrictId=03},
             new Branch () {BranchName="AYAT-49 Branch",BranchCode="307",DistrictId=07},
             new Branch () {BranchName="GARMENT SEFERA",BranchCode="304",DistrictId=05},
             new Branch () {BranchName="ANGECHA BRANCH",BranchCode="308",DistrictId=03},

             new Branch () {BranchName="LAKOMELZA BRANCH",BranchCode="309",DistrictId=04},
             new Branch () {BranchName="ABAKORAN BRANCH",BranchCode="312",DistrictId=06},
             new Branch () {BranchName="JEMO ADEBABAY BRANCH",BranchCode="313",DistrictId=05},
             new Branch () {BranchName="COCA MAZORIA BRANCH",BranchCode="311",DistrictId=06},

             new Branch () {BranchName="BALE GOBA BRANCH",BranchCode="310",DistrictId=01},
             new Branch () {BranchName="SHUFUNE BRANCH",BranchCode="318",DistrictId=06},
             new Branch () {BranchName="GORO SEFERA BRANCH ",BranchCode="316",DistrictId=07},
             new Branch () {BranchName="MEKANISA KOTARI BRANCH",BranchCode="317",DistrictId=05},

             new Branch () {BranchName="KETTA BRANCH",BranchCode="319",DistrictId=06},
             new Branch () {BranchName="WADU BRANCH",BranchCode="324",DistrictId=03},
             new Branch () {BranchName="MUKE-TURI BRANCH",BranchCode="321",DistrictId=06},
             new Branch () {BranchName="SARIS 58 BRANCH",BranchCode="314",DistrictId=05},

             new Branch () {BranchName="EJERE BRANCH",BranchCode="320",DistrictId=06},
             new Branch () {BranchName="DATO BRANCH",BranchCode="323",DistrictId=03},
             new Branch () {BranchName="AZEZO BRANCH ",BranchCode="325",DistrictId=04},
             new Branch () {BranchName="TULU BOLO BRANCH",BranchCode="326",DistrictId=06},

             new Branch () {BranchName="SARIS BRANCH",BranchCode="327",DistrictId=05},
             new Branch () {BranchName="BAHIL ADARASH BRANCH",BranchCode="322",DistrictId=03},
             new Branch () {BranchName="EUROPEAN UNION BRANCH",BranchCode="315",DistrictId=07},
             new Branch () {BranchName="DIRE DAWA MESKELEGNA BRANCH",BranchCode="328",DistrictId=01},

             new Branch () {BranchName="AGENNA BRANCH",BranchCode="329",DistrictId=06},
             new Branch () {BranchName="AFRICA HIBRET BRANCH",BranchCode="330",DistrictId=05},
             new Branch () {BranchName="SUMMIT BRANCH ",BranchCode="332",DistrictId=07},
             new Branch () {BranchName="BONOSHA BRANCH",BranchCode="331",DistrictId=03},

             new Branch () {BranchName="KARA KORE BRANCH",BranchCode="333",DistrictId=06},
             new Branch () {BranchName="GOFA CAMP BRANCH",BranchCode="334",DistrictId=05},
             new Branch () {BranchName="KELLA BRANCH",BranchCode="336",DistrictId=03},
             new Branch () {BranchName="SHENEN GIBE BRANCH",BranchCode="335",DistrictId=02},

             new Branch () {BranchName="18 MAZORIA BRANCH",BranchCode="337",DistrictId=06},
             new Branch () {BranchName="KOLLA SHELE BRANCH",BranchCode="339",DistrictId=03},
             new Branch () {BranchName="KOYE FECHE BRANCH",BranchCode="338",DistrictId=07},
             new Branch () {BranchName="SARIS ABO BRANCH",BranchCode="340",DistrictId=05},

             new Branch () {BranchName="ABUWARE BRANCH",BranchCode="341",DistrictId=07},
             new Branch () {BranchName="ZENEBEWORK-TABOTMADERIA",BranchCode="342",DistrictId=06},
             new Branch () {BranchName="HARARHAKIM BRANCH",BranchCode="343",DistrictId=01},
             new Branch () {BranchName="ADAMADEMBELA BRANCH",BranchCode="344",DistrictId=01},
             new Branch () {BranchName="WASHINGTON ADEBABAY BRANCH",BranchCode="345",DistrictId=05},


             new Branch () {BranchName="FIGA BRANCH",BranchCode="346",DistrictId=07},
             new Branch () {BranchName="ERTU LEBU BRANCH",BranchCode="347",DistrictId=06},
             new Branch () {BranchName="TEBASE BRANCH",BranchCode="348",DistrictId=01},
             new Branch () {BranchName="SHASHEMENE MOBIL BRANCH",BranchCode="349",DistrictId=01},
             new Branch () {BranchName="JACROS BRANCH",BranchCode="350",DistrictId=05},


             new Branch () {BranchName="GELEMSO BRANCH",BranchCode="351",DistrictId=07},
             new Branch () {BranchName="ARADA BRANCH",BranchCode="352",DistrictId=06},
             new Branch () {BranchName="DERARO BRANCH",BranchCode="353",DistrictId=01},
             new Branch () {BranchName="HAWASSA ALAMURA",BranchCode="354",DistrictId=01},
             new Branch () {BranchName="ARSIROBE BRANCH",BranchCode="355",DistrictId=05},

             new Branch () {BranchName="DEJEN BRANCH",BranchCode="356",DistrictId=07},
             new Branch () {BranchName="MERILOKE BRANCH",BranchCode="357",DistrictId=06},
             new Branch () {BranchName="SEA'LITE MIHRET BRANCH",BranchCode="358",DistrictId=01},
             new Branch () {BranchName="LAFTOMEBRAT BRANCH",BranchCode="359",DistrictId=01},
             new Branch () {BranchName="MOTTA BRANCH",BranchCode="360",DistrictId=05},

             new Branch () {BranchName="DEBARK BRANCH",BranchCode="361",DistrictId=07},
             new Branch () {BranchName="BALE EGZIABHER BRANCH",BranchCode="362",DistrictId=06},
             new Branch () {BranchName="ADA’A BRANCH",BranchCode="363",DistrictId=01},
             new Branch () {BranchName="MELKA GEFERSA BRANCH",BranchCode="364",DistrictId=01},
             new Branch () {BranchName="COMMERCE BRANCH",BranchCode="365",DistrictId=05},

             new Branch () {BranchName="JAWI BRANCH",BranchCode="366",DistrictId=07},
             new Branch () {BranchName="DANEMA BRANCH",BranchCode="367",DistrictId=06},
             new Branch () {BranchName="ARADA GIORGIS BRANCH",BranchCode="368",DistrictId=01},
             new Branch () {BranchName="MUDULA BRANCH",BranchCode="369",DistrictId=01},
             new Branch () {BranchName="YIRGA CHEFFE BRANCH",BranchCode="370",DistrictId=05},

             new Branch () {BranchName="WOLLO SEFER ADEBABAY",BranchCode="371",DistrictId=07},
             new Branch () {BranchName="BULBULA BRANCH",BranchCode="372",DistrictId=06},
             new Branch () {BranchName="ADOLA WOYU BRANCH",BranchCode="373",DistrictId=01},
             new Branch () {BranchName="GOTERA PEPSI BRANCH",BranchCode="374",DistrictId=01},
             new Branch () {BranchName="PASTOR BRANCH",BranchCode="375",DistrictId=05},

             new Branch () {BranchName="ASKO BRANCH",BranchCode="376",DistrictId=07},
             new Branch () {BranchName="AMERICAN GIBI BRANCH",BranchCode="377",DistrictId=06},
             new Branch () {BranchName="GERJI ROBA BRANCH",BranchCode="378",DistrictId=01},
             new Branch () {BranchName="KILINTO BRANCH",BranchCode="379",DistrictId=01},
             new Branch () {BranchName="SENGATERA BRANCH",BranchCode="379",DistrictId=05},

    };

}
