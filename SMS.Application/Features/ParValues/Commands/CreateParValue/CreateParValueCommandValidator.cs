using FluentValidation;

namespace SMS.Application
{
    public class CreateParValueCommandValidator : AbstractValidator<CreateParValueCommand>
    {
        private readonly IDataService dataService;

        public CreateParValueCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;

            RuleFor(p => p.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(p => p.Amount).GreaterThan(0).WithMessage("Amount must be greater than 0");

            RuleFor(p => p)
            .Must(BeTheFirstParValue)
                .WithMessage(x => $"Bad request");
        }

        private bool BeTheFirstParValue(CreateParValueCommand cmd) => dataService.ParValues.FirstOrDefault() == null;

    }
}
