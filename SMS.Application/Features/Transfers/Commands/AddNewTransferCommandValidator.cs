using FluentValidation;

namespace SMS.Application;

public class AddNewTransferCommandValidator : AbstractValidator<AddNewTransferCommand>
{
    private readonly IDataService dataService;
    private readonly IDividendService dividendService;

    public AddNewTransferCommandValidator(IDataService dataService, IDividendService dividendService)
    {
        this.dataService = dataService;
        this.dividendService = dividendService;
        RuleFor(p => p).Must(HaveValidTransferer).WithMessage(x => "Unable to find Transferer");
        RuleFor(p => p).Must(HaveAtLeastOneTransferee).WithMessage(x => "Transferee is required");
        RuleFor(p => p).Must(NotHaveOtherActiveTransfer).WithMessage(x => "Already have another transfer in progress");
        RuleFor(p => p).Must(HaveDistinctTransferee).WithMessage(x => "Duplicate transferee");
        RuleFor(p => p).Must(HavePositiveTransferAmount).WithMessage(x => "Transfer amount should be greater than zero");
        RuleFor(p => p).Must(TransferAllAllocatedTransferAmount).WithMessage(x => "Total amount to transfer doesn't match with sum of individual transfers");
        RuleFor(p => p).Must(HaveValidBranch).WithMessage("Invalid branch");
        RuleFor(p => p).Must(HaveValidDistrict).WithMessage("Invalid district");
        RuleFor(p => p).Must(HaveAllValidTransferees).WithMessage(x => "Unable to find one or more transferees");
        RuleFor(p => p).Must(HaveEnoughBalance).WithMessage(x => $"Cannot transfer {x.TotalTransferAmount} ETB.");
        RuleFor(p => p).MustAsync(HaveValidTransferEffectiveDate).WithMessage("Effective Date should be within the current dividend period");
        RuleFor(p => p).Must(HaveValidTransferSaleValue).WithMessage("Transfer Sell value is required");
        RuleFor(p => p).Must(HaveValidCapitalGainTaxValue).WithMessage("Capital Gain Tax is required");
    }

    private bool HaveValidCapitalGainTaxValue(AddNewTransferCommand command)
    {
        var sellValue = command.SellValue ?? 0;
        var capitalGainTax = command.CapitalGainTax ?? 0;
        var transferAmount = command.TotalTransferAmount;

        return command.TransferType == Domain.TransferTypeEnum.Sale && sellValue > transferAmount && capitalGainTax <= 0 ? false : true;
    }

    private bool HaveValidTransferSaleValue(AddNewTransferCommand command) => command.TransferType == Domain.TransferTypeEnum.Sale && (command.SellValue ?? 0) <= 0 ? false : true;

    private async Task<bool> HaveValidTransferEffectiveDate(AddNewTransferCommand command, CancellationToken token)
    {
        var currentDividendPeriod = await dividendService.GetCurrentDividendPeriod();
        if (currentDividendPeriod == null) return false;

        var startDate = currentDividendPeriod.StartDate;
        var endDate = currentDividendPeriod.EndDate.AddDays(1);

        return command.EffectiveDate < startDate || command.EffectiveDate > endDate ? false : true;
    }

    private bool HaveValidTransferer(AddNewTransferCommand command) => dataService.Shareholders.Any(s => s.Id == command.FromShareholderId);

    private bool HaveValidBranch(AddNewTransferCommand command) => dataService.Branches.Any(s => s.Id == command.BranchId);

    private bool HaveValidDistrict(AddNewTransferCommand command) => dataService.Districts.Any(s => s.Id == command.DistrictId);

    private bool HaveAtLeastOneTransferee(AddNewTransferCommand command) => command.Transferees.Count > 0;

    private bool HaveDistinctTransferee(AddNewTransferCommand command) => command.Transferees.Select(x => x.ShareholderId)
                                                                                             .Distinct()
                                                                                             .Count() == command.Transferees.Count;

    public bool NotHaveOtherActiveTransfer(AddNewTransferCommand command) => !dataService.Transfers.Any(x => x.FromShareholderId == command.FromShareholderId
                                                                                                             && x.ApprovalStatus != Domain.Enums.ApprovalStatus.Approved);

    private bool HavePositiveTransferAmount(AddNewTransferCommand command) => command.TotalTransferAmount > 0 && command.Transferees.All(t => t.Amount > 0);

    private bool TransferAllAllocatedTransferAmount(AddNewTransferCommand command) => command.TotalTransferAmount == command.Transferees.Select(x => x.Amount).Sum();

    private bool HaveEnoughBalance(AddNewTransferCommand command) => true; //TODO

    private bool HaveAllValidTransferees(AddNewTransferCommand command)
    {
        var transferees = command.Transferees.Select(x => x.ShareholderId);
        var ids = dataService.Shareholders.Where(x => transferees.Contains(x.Id)).Select(x => x.Id).ToList();
        return transferees.All(x => ids.Contains(x));
    }
}
