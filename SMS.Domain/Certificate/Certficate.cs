using SMS.Domain.Enums;

namespace SMS.Domain
{
    public class CertificateAttachments
    {
        public string DocumentId { get; set; }
        public bool IsImage { get; set; }
        public string FileName { get; set; }
    }
    public class Certficate : WorkflowEnabledEntity
    {
        public int Id { get; set; }
        public string CertificateNo { get; set; }
        public string? SerialNumberRange { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public PaymentMethodEnum PaymentMethodEnum { get; set; }
        public CertficateType CertficateType { get; set; }
        public CertificateIssuanceTypeEnum CertificateIssuanceTypeEnum { get; set; }
        public int ShareholderId { get; set; }
        public DateOnly IssueDate { get; set; }
        public decimal PaidupAmount { get; set; }
        public string? ReceiptNo { get; set; }
        public bool IsActive { get; set; }
        public bool IsPrinted { get; set; }
        public string? Note { get; set; }
        public List<CertificateAttachments> Attachments { get; set; }
        public Shareholder Shareholder { get; set; }
    }
}