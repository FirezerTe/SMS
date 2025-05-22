using SMS.Domain.Enums;

namespace SMS.Application.Features.Certificate.Queries
{
    public class CertificateDto
    {
        public int Id { get; set; }
        public string CertificateNo { get; set; }
        public string? SerialNumberRange { get; set; }
        public PaymentMethodEnum PaymentMethodEnum { get; set; }
        public CertificateIssuanceTypeEnum CertificateIssuanceTypeEnum { get; set; }
        public int ShareholderId { get; set; }
        public DateOnly IssueDate { get; set; }
        public decimal PaidupAmount { get; set; }
        public string? ReceiptNo { get; set; }
        public bool IsActive { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        public bool IsPrinted { get; set; }
        public string? Note { get; set; }
    }
}