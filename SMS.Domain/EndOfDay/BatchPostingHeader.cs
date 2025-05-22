namespace SMS.Domain.EndOfDay
{
    public class BatchPostingHeader : AuditableEntity, IEntity
    {
        public int Id { get; set; }
        public string? RubRespHeader_RespCode { get; set; }
        public bool? RubRespHeader_Success { get; set; }
        public string? RubRespHeader_Maker { get; set; }
        public string? RubRespHeader_BatchNo { get; set; }
        public string? RubRespHeader_ResponseMessage { get; set; }
        public string? RubRespHeader_Branch { get; set; }
        public string? RubRespHeader_RubId { get; set; }
        public string? RubRespHeader_Splitledger { get; set; }
        public DateOnly? RubRespHeader_MDate { get; set; }
        public string? RubRespHeader_PostingType { get; set; }
    }
}
