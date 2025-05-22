using FluentValidation;

namespace SMS.Application;

public class DeleteTransferCommandValidator : AbstractValidator<DeleteTransferCommand>
{
    private readonly IDataService dataService;

    public DeleteTransferCommandValidator(IDataService dataService)
    {
        this.dataService = dataService;
        RuleFor(t => t)
        .Must(Exist)
        .WithMessage("Unable to find transfer");

        RuleFor(t => t)
        .Must(BeUnapproved)
        .WithMessage("Cannot delete approved transfer");
    }

    private bool Exist(DeleteTransferCommand request)
    {
        var transfer = dataService.Transfers.FirstOrDefault(t => t.Id == request.Id);
        return transfer != null;
    }

    private bool BeUnapproved(DeleteTransferCommand request)
    {
        var transfer = dataService.Transfers.FirstOrDefault(t => t.Id == request.Id);
        return transfer != null && transfer.ApprovalStatus != Domain.Enums.ApprovalStatus.Approved;

    }
}
