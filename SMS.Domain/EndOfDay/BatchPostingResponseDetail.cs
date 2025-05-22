namespace SMS.Domain.EndOfDay
{
    public class BatchPostingResponseDetail : AuditableEntity, IEntity
    {
        public int Id { get; set; }
        public string? RubRespDetail_RubRespHeader { get; set; }
        public string? RubRespDetail_Message { get; set; }
        public string? RubRespDetail_Success { get; set; }
        public string? RubRespDetail_TracerNo { get; set; }
        public string? RubRespDetail_ResponseCode { get; set; }
        public int? RubRespDetail_TxnId { get; set; }
        public string? RubRespDetail_Narration { get; set; }
        public decimal? RubRespDetail_Amount { get; set; }
        public string? RubRespDetail_TxnType { get; set; }
        public string? RubRespDetail_AccountNo { get; set; }
        public DateOnly? RubRespDetail_MDate { get; set; }
        public string? RubRespDetail_PostingType { get; set; }
    }
}