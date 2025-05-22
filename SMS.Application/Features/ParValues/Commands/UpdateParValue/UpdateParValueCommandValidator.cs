using FluentValidation;

namespace SMS.Application
{
    public class UpdateParValueCommandValidator : AbstractValidator<UpdateParValueCommand>
    {
        private readonly IDataService dataService;

        public UpdateParValueCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;

            RuleFor(p => p.Name).NotEmpty().WithMessage("Name is required.");
            RuleFor(p => p.Amount).GreaterThan(0).WithMessage("Amount must be greater than 0");

            RuleFor(p => p)
               .Must(Exist)
               .WithMessage(x => $"Cannot find par value.");
        }

        private bool Exist(UpdateParValueCommand command)
        {
            return dataService.ParValues.Any(s => s.Id == command.Id);
        }
    }
}
