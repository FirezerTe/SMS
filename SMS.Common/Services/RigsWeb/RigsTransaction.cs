namespace SMS.Common.Services.RigsWeb
{
    public class RigsTransaction
    {
        public int Id { get; set; }
        public string transactionIdField { get; set; }

        public string accountNumberField { get; set; }

        public string transactionDateField { get; set; }

        public string valueDateField { get; set; }

        public decimal transactionAmountField { get; set; }

        public bool transactionAmountFieldSpecified { get; set; }

        public string currencyField { get; set; }

        public string transactionTypeField { get; set; }

        public string narrationField { get; set; }

        public string eventCodeField { get; set; }

        public string eventCodeDescriptionField { get; set; }

        public string businessUnitField { get; set; }

        public decimal statementBalanceField { get; set; }

        public bool statementBalanceFieldSpecified { get; set; }

        public string contraAccountNumberField { get; set; }

        public string rrnField { get; set; }

        public string transactionReferenceTextField { get; set; }

        public string recordStatusField { get; set; }
        public string rigsUname { get; set; }
        public string rigsPname { get; set; }
        public string AccountName { get; set; }
        public string AccountType { get; set; }
        public string ProductName { get; set; }
        public string AccountStatus { get; set; }
        public decimal AvailableBalance { get; set; }
        public string? AccountValidationMessage { get; set; }
    }
}
