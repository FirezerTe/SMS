
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Allocation.Queries.AlocationForEachShareholder;
using SMS.Application.Features.Certificate.Command;
using SMS.Application.Features.Certificate.Queries;
using SMS.Application.Features.EndOfDay.Models;
using SMS.Application.Features.Payments.Models;
using SMS.Application.Features.Reports;
using SMS.Application.Features.ShareHolders;
using SMS.Application.Features.Subscriptions.Models;
using SMS.Application.Lookups;
using SMS.Application.Models;
using SMS.Common.Services.RigsWeb;
using SMS.Domain;
using SMS.Domain.Bank;
using SMS.Domain.EndOfDay;
using SMS.Domain.Enums;
using SMS.Domain.GL;
using SMS.Domain.Lookups;
using SMS.Domain.SubscriptionAllocation;
using SMS.Domain.User;

namespace SMS.Application.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Shareholder, ShareholderBasicInfo>()
           .Include<Shareholder, ShareholderDetailsDto>()
           .ForMember(dest => dest.PhotoId, opt => opt.MapFrom(src => src.ShareholderDocuments
            .Where(sd => sd.DocumentType == DocumentType.ShareholderPicture)
            .Select(x => x.DocumentId).FirstOrDefault()))
           .ForMember(dest => dest.SignatureId, opt => opt.MapFrom(src => src.ShareholderDocuments
            .Where(sd => sd.DocumentType == DocumentType.ShareholderSignature)
            .Select(x => x.DocumentId).FirstOrDefault()));

        CreateMap<ApprovedShareholder, ShareholderSummary>();
        CreateMap<RejectedShareholderApprovalRequest, ShareholderSummary>();
        CreateMap<DraftShareholder, ShareholderSummary>();
        CreateMap<ShareholderApprovalRequest, ShareholderSummary>();
        CreateMap<Shareholder, ShareholderSummary>();
        CreateMap<ShareholderChangeLog, ShareholderChangeLogDto>();
        CreateMap<Shareholder, ShareholderInfo>()
            .ForMember(dest =>
            dest.IsCurrent, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodEnd") > DateTime.UtcNow));
        CreateMap<ShareholderBasicInfo, Shareholder>();
        CreateMap<Shareholder, ShareholderDetailsDto>();
        CreateMap<Address, GetShareHolderAddressDTO>();
        CreateMap<ForeignCurrencyType, ForeignCurrencyDto>();
        CreateMap<Payment, SubscriptionPaymentDto>()
            .ForMember(dest => dest.PeriodStart, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodStart")))
            .ForMember(dest => dest.PeriodEnd, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodEnd")))
            .ForMember(dest => dest.Receipts, opt => opt.Ignore())
            .ForMember(dest => dest.UnapprovedAdjustments, opt => opt.Ignore())
            .ForMember(dest => dest.HasChildPayment, opt => opt.Ignore())
            .ForMember(dest => dest.UnapprovedTransfers, opt => opt.Ignore())
            .ForMember(dest => dest.ParentPayment, opt => opt.Ignore());
        CreateMap<ShareholderDocument, ShareholderDocumentDto>();
        CreateMap<SubscriptionPaymentReceipt, SubscriptionPaymentReceiptDto>();
        CreateMap<Address, AddressDto>();
        CreateMap<ShareholderType, LookupDto>();
        CreateMap<PaymentType, LookupDto>();
        CreateMap<PaymentMethod, LookupDto>();
        CreateMap<Country, CountryDto>();
        CreateMap<TransferType, LookupDto>();
        CreateMap<TransferDividendTerm, LookupDto>();
        CreateMap<ForeignCurrencyType, LookupDto>();
        CreateMap<Country, CountryDto>();
        CreateMap<Contact, ContactDto>();
        CreateMap<Family, FamilyDto>();
        CreateMap<Allocation, AllocationInfo>().ForMember(dest => dest.IsLatestRecord, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodEnd") > DateTime.UtcNow)).ReverseMap();
        CreateMap<AllocationSubscriptionSummary, AllocationSubscriptionSummaryDto>()
            .ForMember(dest => dest.AllocationName, opt => opt.Ignore())
            .ForMember(dest => dest.IsOnlyForExistingShareholders, opt => opt.Ignore())
            .ForMember(dest => dest.IsDividendAllocation, opt => opt.Ignore())
            .ForMember(dest => dest.AllocationDescription, opt => opt.Ignore());
        CreateMap<Allocation, AllocationDto>()
            .ForMember(dest => dest.IsActive, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt =>
             opt.MapFrom(src => src.ApprovalStatus == ApprovalStatus.Approved && (src.ToDate == null || src.ToDate >= DateOnly.FromDateTime(DateTime.Now))))
            .ForMember(dest => dest.PeriodStart, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodStart")))
            .ForMember(dest => dest.PeriodEnd, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodEnd")))
            .ForMember(dest => dest.IsLatestRecord, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodEnd") > DateTime.UtcNow));
        CreateMap<ShareholderAllocation, ShareholderAllocationDto>();
        CreateMap<Country, CountryDto>().ReverseMap();
        CreateMap<Allocation, Lookups.AllocationDto>().ReverseMap();
        CreateMap<Bank, BankAllocationDto>()
            .ForMember(dest => dest.PeriodStart, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodStart")))
            .ForMember(dest => dest.PeriodEnd, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodEnd")));
        CreateMap<Branch, BranchDto>().ReverseMap();
        CreateMap<District, DistrictDto>().ReverseMap();
        CreateMap<ShareholderType, LookupDto>();
        CreateMap<Country, CountryDto>();
        CreateMap<Country, CountryDto>().ReverseMap();
        CreateMap<Allocation, Lookups.AllocationDto>().ReverseMap();
        CreateMap<Branch, BranchDto>().ReverseMap();
        CreateMap<BlockedShareholder, ShareholderBlockDetail>();
        CreateMap<BlockedShareholderAttachment, BlockedShareholderAttachmentDto>();
        CreateMap<Subscription, ShareholderSubscriptionDto>()
            .ForMember(dest => dest.PaymentSummary, opt => opt.Ignore())
            .ForMember(dest => dest.PeriodStart, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodStart")))
            .ForMember(dest => dest.PeriodEnd, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodEnd")));
        CreateMap<SubscriptionPaymentSummary, SubscriptionPaymentSummaryDto>();
        CreateMap<SubscriptionDocument, SubscriptionDocumentDto>();
        CreateMap<Allocation, CreateAllocationCommandHandler>().ReverseMap();
        CreateMap<SubscriptionGroup, SubscriptionGroupInfo>();
        CreateMap<SubscriptionPremium, SubscriptionPremiumDto>();
        CreateMap<PremiumRange, PremiumRangeDto>();
        CreateMap<ParValue, CreateParValueCommand>().ReverseMap();
        CreateMap<ParValue, ParValueDto>()
            .ForMember(dest => dest.PeriodStart, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodStart")))
            .ForMember(dest => dest.PeriodEnd, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodEnd")));
        CreateMap<CreateShareholderCommand, Shareholder>().ReverseMap();
        CreateMap<GetSubscriptionAllocationQuery, SubscriptionAllocation>().ReverseMap();
        CreateMap<SubscriptionAllocation, SubscriptionAllocation>().ReverseMap();
        CreateMap<SMSRole, ApplicationRole>();
        CreateMap<Transfer, TransferDto>().ForMember(dest => dest.TransferDocuments, opt => opt.Ignore());
        CreateMap<Transferee, TransfereeDto>();
        CreateMap<Payment, PaymentInfo>().ReverseMap();
        CreateMap<Subscription, SubscriptionInfo>().ReverseMap();
        CreateMap<GeneralLedger, GeneralLedgerDto>().ReverseMap();
        CreateMap<RigsResponseDto, DailySummary>().ReverseMap();

        CreateMap<DividendPeriod, DividendPeriodDto>();
        CreateMap<DividendSetup, DividendSetupDto>()
        .ForMember(dest => dest.TaxApplied, opt => opt.Ignore())
        .ForMember(dest => dest.HasPendingDecision, opt => opt.Ignore());
        CreateMap<Dividend, ShareholderDividendDto>();
        CreateMap<DividendDecision, DividendDecisionDto>();
        CreateMap<Dividend, DividendDto>()
            .ForMember(dest => dest.ShareholderDisplayName, opt => opt.MapFrom(src => src.Shareholder.DisplayName));
        CreateMap<PaymentsWeightedAverage, ShareholderDividendPaymentDto>();
        CreateMap<WorkflowEnabledEntity, WorkflowEnabledEntityDto>()
        .ForMember(dest => dest.PeriodStart, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodStart")))
            .ForMember(dest => dest.PeriodEnd, opt => opt.MapFrom(src => EF.Property<DateTime>(src, "PeriodEnd")));
        CreateMap<Certficate, CertificateDto>().ReverseMap();
        CreateMap<Certficate, PrepareShareholderCertificateCommand>().ReverseMap();
        CreateMap<Certficate, UpdateShareholderCertificateCommand>().ReverseMap();
        CreateMap<TransfereeInfo, Transferee>().ReverseMap();
    }
}
