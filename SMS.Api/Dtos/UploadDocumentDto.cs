namespace SMS.Api.Dtos;

public record DocumentEndpointRootPath(string Path);
public record UploadPaymentReceiptDto(IFormFile File);
public record UploadDocumentDto(IFormFile File, int SubscriptionId, int PaymentId, int TransferId);
public record UploadSubscriptionDocumentDto(IFormFile File, int SubscriptionId);
public record class DocumentMetadataDto(string Id);
public record UploadBlockDocumentDto(IFormFile File);
public record UploadTransferDocumentDto(IFormFile File);
public record UploadDividendDecisionDocumentDto(IFormFile File);
public record UploadCertificateIssueDocumentDto(IFormFile File);
