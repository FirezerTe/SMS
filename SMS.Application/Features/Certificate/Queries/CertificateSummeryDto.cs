

namespace SMS.Application.Features.Certificate.Queries.Certificate
{
    public class CertificateSummeryDto
    {
        public List<CertificateDto> Certificates { get; set; }
        public decimal TotalAvailablePaidup { get; set; }
    }
}