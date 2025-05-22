using FluentValidation;

namespace SMS.Application;

public class UpdateTransferCommandValidator : AbstractValidator<UpdateTransferCommand>
{
    private readonly IDataService dataService;
    private readonly IDividendService dividendService;

    public UpdateTransferCommandValidator(IDataService dataService, IDividendService dividendService)
    {
        this.dataService = dataService;
        this.dividendService = dividendService;
        RuleFor(t => t).Must(Exist).WithMessage("Unable to find transfer");
        RuleFor(t => t).Must(BeUnapproved).WithMessage("Cannot change approved transfer");
        RuleFor(p => p).Must(HaveAtLeastOneTransferee).WithMessage(x => "Transferee is required");
        RuleFor(p => p).Must(HaveDistinctTransferee).WithMessage(x => "Duplicate transferee");
        RuleFor(p => p).Must(HavePositiveTransferAmount).WithMessage(x => "Transfer amount should be greater than zero");
        RuleFor(p => p).Must(TransferAllAllocatedTransferAmount).WithMessage(x => "Total amount to transfer doesn't match with sum of individual transfers");
        RuleFor(p => p).Must(HaveValidBranch).WithMessage("Invalid branch");
        RuleFor(p => p).Must(HaveValidDistrict).WithMessage("Invalid district");
        RuleFor(p => p).Must(HaveAllValidTransferees).WithMessage(x => "Unable to find one or more transferees");
        RuleFor(p => p).Must(HaveEnoughBalance).WithMessage(x => $"Cannot transfer {x.TotalTransferAmount} ETB.");
        RuleFor(p => p).MustAsync(HaveValidTransferEffectiveDate).WithMessage("Effective Date should be within the current dividend period");
        RuleFor(p => p).Must(HaveValidTransferSaleValue).WithMessage("Sell value is required");
        RuleFor(p => p).Must(HaveValidCapitalGainTaxValue).WithMessage("Capital Gain Tax is required");
    }

    private bool HaveValidCapitalGainTaxValue(UpdateTransferCommand command)
    {
        var sellValue = command.SellValue ?? 0;
        var capitalGainTax = command.CapitalGainTax ?? 0;
        var transferAmount = command.TotalTransferAmount;

        return command.TransferType == Domain.TransferTypeEnum.Sale && sellValue > transferAmount && capitalGainTax <= 0 ? false : true;
    }

    private bool HaveValidTransferSaleValue(UpdateTransferCommand command) => command.TransferType == Domain.TransferTypeEnum.Sale && (command.SellValue ?? 0) <= 0 ? false : true;

    private async Task<bool> HaveValidTransferEffectiveDate(UpdateTransferCommand command, CancellationToken token)
    {
        var currentDividendPeriod = await dividendService.GetCurrentDividendPeriod();
        if (currentDividendPeriod == null) return false;

        var startDate = currentDividendPeriod.StartDate;
        var endDate = currentDividendPeriod.EndDate.AddDays(1);

        return command.EffectiveDate < startDate || command.EffectiveDate > endDate ? false : true;
    }

    public bool Exist(UpdateTransferCommand request)
    {
        var transfer = dataService.Transfers.FirstOrDefault(t => t.Id == request.TransferId);
        return transfer != null;
    }

    public bool BeUnapproved(UpdateTransferCommand request)
    {
        var transfer = dataService.Transfers.FirstOrDefault(t => t.Id == request.TransferId);
        return transfer != null && transfer.ApprovalStatus != Domain.Enums.ApprovalStatus.Approved;
    }


    private bool HaveValidBranch(UpdateTransferCommand command) => dataService.Branches.Any(s => s.Id == command.BranchId);

    private bool HaveValidDistrict(UpdateTransferCommand command) => dataService.Districts.Any(s => s.Id == command.DistrictId);

    private bool HaveAtLeastOneTransferee(UpdateTransferCommand command) => command.Transferees.Count > 0;

    private bool HaveDistinctTransferee(UpdateTransferCommand command) => command.Transferees.Select(x => x.ShareholderId)
                                                                                             .Distinct()
                                                                                             .Count() == command.Transferees.Count;



    private bool HavePositiveTransferAmount(UpdateTransferCommand command) => command.TotalTransferAmount > 0 && command.Transferees.All(t => t.Amount > 0);

    private bool TransferAllAllocatedTransferAmount(UpdateTransferCommand command) => command.TotalTransferAmount == command.Transferees.Select(x => x.Amount).Sum();

    private bool HaveEnoughBalance(UpdateTransferCommand command) => true; //TODO

    private bool HaveAllValidTransferees(UpdateTransferCommand command)
    {
        var transferees = command.Transferees.Select(x => x.ShareholderId);
        var ids = dataService.Shareholders.Where(x => transferees.Contains(x.Id)).Select(x => x.Id).ToList();
        return transferees.All(x => ids.Contains(x));
    }
}
