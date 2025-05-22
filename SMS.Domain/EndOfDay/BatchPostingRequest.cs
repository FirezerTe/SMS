namespace SMS.Domain.EndOfDay
{
    public class BatchPostingRequest : AuditableEntity, IEntity
    {
        public int Id { get; set; }
        public string? RubikonRequest_BatchNo { get; set; }
        public string? RubikonRequest_BatchDesc { get; set; }
        public int? RubikonRequest_BranchId { get; set; }
        public string? RubikonRequest_RubId { get; set; }
        public string? RubikonRequest_SplitLedger { get; set; }
        public string? RubikonRequest_TracerNo { get; set; }
        public string? RubikonRequest_Narration { get; set; }
        public string? RubikonRequest_Currency { get; set; }
        public decimal? RubikonRequest_Amount { get; set; }
        public string? RubikonRequest_RubTxnType { get; set; }
        public string? RubikonRequest_AccountNo { get; set; }
        public string? RubikonRequest_Maker { get; set; }
        public DateOnly? RubikonRequest_MDate { get; set; }
        public string? RubikonRequest_ResponseMessage { get; set; }
        public string? RubikonRequest_PostingType { get; set; }
    }
}
