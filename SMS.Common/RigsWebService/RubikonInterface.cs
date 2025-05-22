using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using RigsWebService;
using SMS.Common.Services.RigsWeb;
using SMS.Domain.EndOfDay;
using SMS.Domain.Enums;
using System.Security.Cryptography;
using System.ServiceModel;
using System.Text;

namespace SMS.Common.RigsWebService
{
    public class RubikonInterface : IRigsWebService
    {
        private readonly IDataService dataService;
        private readonly ILogger logger;
        private readonly IConfiguration configuration;
        private readonly IMediator mediator;
        private credential objUser;
        private RigsTransaction objRigs;

        public RubikonInterface(IDataService dataService, IConfiguration configuration, IMediator mediator, ILogger<RubikonInterface> logger)
        {
            this.dataService = dataService;
            this.configuration = configuration;
            this.mediator = mediator;
            this.logger = logger;
            // Initialize objUser in the constructor

            var CBSMacAddress = configuration.GetValue<string>("Rubikon:CBS:Macaddress");
            var CBSPassword = configuration.GetValue<string>("Rubikon:CBS:Password");
            var CBSUserName = configuration.GetValue<string>("Rubikon:CBS:Username");
            var RigsPassword = configuration.GetValue<string>("Rubikon:CBS:RigsPassword");
            var RigsUserName = configuration.GetValue<string>("Rubikon:CBS:RigsUsername");
            var decryptionKey = configuration.GetValue<string>("Rubikon:CBS:DecryptionKey");

            var CBSUsernameDec = Decrypt(CBSUserName, decryptionKey);
            var CBSPasswordDec = Decrypt(CBSPassword, decryptionKey);
            var RigsUsernameDec = Decrypt(RigsUserName, decryptionKey);
            var RigsPasswordDec = Decrypt(RigsPassword, decryptionKey);

            objUser = new credential
            {
                username = CBSUsernameDec,
                password = CBSPasswordDec,
                macaddress = CBSMacAddress,

            };
            objRigs = new RigsTransaction
            {
                rigsUname = RigsUsernameDec,
                rigsPname = RigsPasswordDec
            };
        }
        private AXRIGSSERVICEClient CreateClient()
        {
            var binding = new BasicHttpBinding
            {
                Security =
                {
                    Mode = BasicHttpSecurityMode.TransportCredentialOnly,
                    Transport =
                    {
                        ClientCredentialType = HttpClientCredentialType.Basic,
                        ProxyCredentialType = HttpProxyCredentialType.Basic
                    }
                }
            };
            var url = configuration.GetValue<string>("WebService:CBS:RigsUrl");
            var endpointAddress = new EndpointAddress(url);

            var objClient = new AXRIGSSERVICEClient(binding, endpointAddress);

            objClient.ClientCredentials.UserName.UserName = objRigs.rigsUname;
            objClient.ClientCredentials.UserName.Password = objRigs.rigsPname;

            return objClient;
        }


        public async Task<bool> IsWebServiceRunning()
        {
            var url = configuration.GetValue<string>("WebService:CBS:RigsUrl");
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync(url);
                    return true;
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return false;
            }
        }

        public void RubiRequestResponse(postBatch _postRequest, postBatchResponse1 _postResponse, DateOnly date, string type)
        {
            foreach (var request in _postRequest.PostBatchReq.transaction)
            {
                var RubiRequest = new BatchPostingRequest
                {
                    RubikonRequest_BatchNo = _postRequest.PostBatchReq.batchReference,
                    RubikonRequest_BatchDesc = _postRequest.PostBatchReq.batchDescription,
                    RubikonRequest_BranchId = (int)_postRequest.PostBatchReq.businessUnitId,
                    RubikonRequest_SplitLedger = _postRequest.PostBatchReq.splitLedger,
                    RubikonRequest_RubId = _postRequest.PostBatchReq.userLoginID,
                    RubikonRequest_Amount = request.txnAmount,
                    RubikonRequest_AccountNo = request.account.accountNumber,
                    RubikonRequest_TracerNo = request.tracerNumber,
                    RubikonRequest_RubTxnType = request.txnType,
                    RubikonRequest_MDate = date,
                    RubikonRequest_ResponseMessage = _postResponse.postBatchResponse.PostBatchRes.response.responseMessage,
                    RubikonRequest_PostingType = type

                };
                dataService.BatchPostingRequests.Add(RubiRequest);
                dataService.Save();
            }
            var RubiHeader = new BatchPostingHeader
            {
                RubRespHeader_RespCode = _postResponse.postBatchResponse.PostBatchRes.response.responseCode,
                RubRespHeader_Success = _postResponse.postBatchResponse.PostBatchRes.successful,
                RubRespHeader_ResponseMessage = _postResponse.postBatchResponse.PostBatchRes.response.responseMessage,
                RubRespHeader_BatchNo = _postResponse.postBatchResponse.PostBatchRes.batchReference,
                RubRespHeader_Splitledger = _postResponse.postBatchResponse.PostBatchRes.splitLedger,
                RubRespHeader_MDate = date,
                RubRespHeader_PostingType = type
            };
            dataService.BatchPostingHeaders.Add(RubiHeader);
            dataService.Save();

            foreach (var response in _postResponse.postBatchResponse.PostBatchRes.transaction)
            {

                var RubiDetail = new BatchPostingResponseDetail
                {
                    RubRespDetail_Message = response.message,
                    RubRespDetail_Narration = response.narration,
                    RubRespDetail_RubRespHeader = RubiHeader.RubRespHeader_BatchNo,
                    RubRespDetail_Amount = response.txnAmount,
                    RubRespDetail_TxnType = response.txnType,
                    RubRespDetail_AccountNo = response.account.accountNumber,
                    RubRespDetail_TxnId = response.txnId,
                    RubRespDetail_ResponseCode = response.responseCode,
                    RubRespDetail_MDate = date,
                    RubRespDetail_Success = response.successful.ToString(),
                    RubRespDetail_PostingType = type
                };
                dataService.BatchPostingResponseDetails.Add(RubiDetail);
                dataService.Save();
            }

        }

        public async Task<RigsResponseDto> PostTransaction(List<EndOfDayDto> transactionListResponses, string batch, DateOnly date, string type)
        {
            var objClient = CreateClient();

            var gl = dataService.GeneralLedgers
                .Where(a => a.Value == GeneralLedgerTypeEnum.ShareProcessingSuspense)
                .FirstOrDefault();

            batchTransaction newBatchTransaction;
            List<batchTransaction> ListTransaction = new List<batchTransaction>();
            postBatch _postBatchTransactionRequest = new postBatch();
            postBatchResponse1 _postBatchTransactionResponse = new postBatchResponse1();
            batchReq objbatchrequest = new batchReq();
            objbatchrequest.userLoginID = objUser.username;// need checking
            objbatchrequest.batchDescription = "SMS Post Testing ";
            objbatchrequest.batchReference = batch;
            objbatchrequest.businessUnitId = 999;
            objbatchrequest.splitLedger = gl.GLNumber;

            foreach (var item in transactionListResponses)
            {
                var refNo = (batch + item.Id);
                var tracer = (item.BranchShareGl + item.Id);
                if (item.Amount != 0)
                {
                    newBatchTransaction = new batchTransaction();
                    newBatchTransaction.account = new batchAccount();
                    newBatchTransaction.account.accountNumber = item.BranchShareGl;
                    newBatchTransaction.account.accountType = item.AccountType;
                    newBatchTransaction.currencyCode = "ETB";
                    newBatchTransaction.tracerNumber = tracer;
                    newBatchTransaction.txnAmount = item.Amount;
                    newBatchTransaction.txnType = item.TransactionType;
                    newBatchTransaction.refNo = refNo;
                    newBatchTransaction.narration = "Transaction Posting" + item.TransactionType + item.Description + DateTime.UtcNow;
                    newBatchTransaction.txnId = item?.Id ?? 0;

                    ListTransaction.Add(newBatchTransaction);
                }
            }
            objbatchrequest.transaction = ListTransaction.ToArray();
            _postBatchTransactionRequest.PostBatchReq = objbatchrequest;
            _postBatchTransactionResponse = await objClient.postBatchAsync(objUser, _postBatchTransactionRequest);
            RubiRequestResponse(_postBatchTransactionRequest, _postBatchTransactionResponse, date, type);

            if (_postBatchTransactionResponse.postBatchResponse.PostBatchRes.response.responseCode == "00")
            {
                var response = new RigsResponseDto
                {
                    BatchReferenceNumber = objbatchrequest.batchReference,
                    Description = _postBatchTransactionResponse.postBatchResponse.PostBatchRes.response.responseMessage
                };
                return response;

            }
            logger.LogError(_postBatchTransactionResponse.postBatchResponse.PostBatchRes.response.responseMessage + batch);
            return null;

        }
        public async Task<List<RigsTransaction>> GetAccountHistory(string AccountNumber, string StartDate, string EndDate)
        {
            var objClient = CreateClient();
            var txnRigsList = new List<RigsTransaction>();
            getAccountHistory objRequest = new getAccountHistory();
            objRequest.AccountHistoryReq = new accountReq();
            objRequest.AccountHistoryReq.accountNumber = AccountNumber;
            objRequest.AccountHistoryReq.startDate = StartDate;
            objRequest.AccountHistoryReq.endDate = EndDate;

            getAccountHistoryResponse1 objResponse = await objClient.getAccountHistoryAsync(objUser, objRequest);
            if (objResponse.getAccountHistoryResponse.AccountHistoryRes.response.responseCode == "00")
            {
                var CRList = objResponse.getAccountHistoryResponse.AccountHistoryRes.transactions.ToList();
                var resp = CRList.Where(a => a.transactionType == RigsTransactionType.CR.ToString()).ToList();
                for (int i = 0; i < resp.Count; i++)
                {
                    var txnList = new RigsTransaction
                    {
                        transactionIdField = resp[i].transactionId,
                        transactionAmountField = resp[i].transactionAmount,
                        transactionDateField = resp[i].transactionDate,
                        transactionReferenceTextField = resp[i].transactionReferenceText,
                        accountNumberField = resp[i].accountNumber,
                        contraAccountNumberField = resp[i].contraAccountNumber,
                        eventCodeDescriptionField = resp[i].eventCodeDescription,
                        businessUnitField = resp[i].businessUnit,
                        eventCodeField = resp[i].eventCode,
                        rrnField = resp[i].rrn,
                        narrationField = resp[i].narration,
                        transactionTypeField = resp[i].transactionType,

                    };
                    txnRigsList.Add(txnList);
                }
                return txnRigsList;
            }
            logger.LogError(objResponse.getAccountHistoryResponse.AccountHistoryRes.response.responseMessage);
            return null;

        }

        public async Task<RigsTransaction> GetAccountInfo(string AccountNumber)
        {
            var objClient = CreateClient();
            var txnRigsList = new RigsTransaction();
            getAccountBalance objRequest = new getAccountBalance();
            objRequest.AccountBalanceReq = new accountReq();
            objRequest.AccountBalanceReq.accountNumber = AccountNumber;

            getAccountBalanceResponse1 objResponse = await objClient.getAccountBalanceAsync(objUser, objRequest);
            if (objResponse.getAccountBalanceResponse.AccountBalanceRes.response.responseCode == "00")
            {
                var Accounts = objResponse.getAccountBalanceResponse.AccountBalanceRes.accounts.ToList();
                foreach (var resp in Accounts)
                {
                    txnRigsList = new RigsTransaction
                    {
                        AccountName = resp.accountName,
                        AccountType = resp.accountType,
                        ProductName = resp.productName,
                        accountNumberField = resp.accountNumber,
                        AccountStatus = resp.status,
                        AvailableBalance = resp.availableBalance,

                    };
                }
                return txnRigsList;

            }
            else
                txnRigsList = new RigsTransaction
                {
                    AccountValidationMessage = objResponse.getAccountBalanceResponse.AccountBalanceRes.response.responseMessage

                };

            logger.LogError(objResponse.getAccountBalanceResponse.AccountBalanceRes.response.responseMessage);
            return txnRigsList;

        }

        public static string Decrypt(string cipherText, string passPhrase)
        {
            try
            {
                var DerivationIterations = 1000;
                var Keysize = 256;
                var ivAndCipherText = Convert.FromBase64String(cipherText);
                var ivStringBytes = ivAndCipherText.Take(16).ToArray();
                var cipherTextBytes = ivAndCipherText.Skip(16).ToArray();

                using (var passwordDerivation = new Rfc2898DeriveBytes(passPhrase, ivStringBytes, DerivationIterations))
                {
                    var keyBytes = passwordDerivation.GetBytes(Keysize / 8);
                    using (var symmetricKey = new RijndaelManaged())
                    {
                        symmetricKey.BlockSize = 128;
                        symmetricKey.Mode = CipherMode.CFB;
                        symmetricKey.Padding = PaddingMode.PKCS7;
                        using (var decryptor = symmetricKey.CreateDecryptor(keyBytes, ivStringBytes))
                        {
                            using (var memoryStream = new MemoryStream(cipherTextBytes))
                            {
                                using (var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                                {
                                    var plainTextBytes = new byte[cipherTextBytes.Length];
                                    var decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
                                    memoryStream.Close();
                                    cryptoStream.Close();
                                    return Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount);
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}