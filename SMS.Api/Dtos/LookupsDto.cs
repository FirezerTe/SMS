using SMS.Application;
using SMS.Application.Lookups;
using SMS.Domain;

namespace SMS.Api.Dtos;

public class LookupsDto
{
    public List<ShareholderType> ShareholderTypes { get; set; }
    public List<CountryDto> Countries { get; set; }
    public List<PaymentType> PaymentTypes { get; set; }
    public List<BranchDto> Branch { get; set; }
    public List<DistrictDto> District { get; set; }
    public List<TransferType> TransferTypes { get; set; }
    public List<TransferDividendTerm> TransferDividendTerms { get; set; }
    public List<PaymentMethod> PaymentMethods { get; set; }
    public List<ForeignCurrencyDto> ForeignCurrencyTypes { get; set; }
    public List<ShareholderStatus> ShareholderStatuses { get; set; }
    public List<ShareholderBlockType> ShareholderBlockTypes { get; set; }
    public List<ShareholderBlockReason> ShareholderBlockReasons { get; set; }
    public DividendPeriodDto? CurrentDividendPeriod { get; set; }
    public List<CertficateType> CertficateTypes { get; set; }
}
