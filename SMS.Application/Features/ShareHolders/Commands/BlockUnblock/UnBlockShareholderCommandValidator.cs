using FluentValidation;

namespace SMS.Application
{
    public class UnBlockShareholderCommandValidator : AbstractValidator<UnBlockShareholderCommand>
    {
        private readonly IDataService dataService;

        public UnBlockShareholderCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            RuleFor(p => p.Description).NotEmpty().WithMessage("Unblock shareholder description is required.");
            RuleFor(p => p)
                .Must(Exist)
                .WithMessage(x => $"Unable to find shareholder.");
        }

        private bool Exist(UnBlockShareholderCommand command)
        {
            return dataService.Shareholders.Any(s => s.Id == command.ShareholderId);
        }
    }
}
