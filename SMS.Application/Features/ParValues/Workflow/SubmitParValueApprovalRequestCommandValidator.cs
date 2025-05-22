using FluentValidation;
using SMS.Domain.Enums;

namespace SMS.Application
{
    public class SubmitParValueApprovalRequestCommandValidator : AbstractValidator<SubmitParValueApprovalRequestCommand>
    {
        private readonly IDataService dataService;

        public SubmitParValueApprovalRequestCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            RuleFor(p => p.Comment).NotEmpty().WithMessage("Comment is required for submission.");
            RuleFor(p => p)
                .Must(Exist)
                .WithMessage(x => $"Unable to find parvalue.");
            RuleFor(p => p)
                .Must(ShouldHaveDraftForApprovalStatus)
                .WithMessage(x => $"Cannot submit a non-draft record");
        }

        private bool Exist(SubmitParValueApprovalRequestCommand command)
        {
            return dataService.ParValues.Any(s => s.Id == command.Id);
        }

        private bool ShouldHaveDraftForApprovalStatus(SubmitParValueApprovalRequestCommand command)
        {
            return dataService.ParValues.Any(s => s.Id == command.Id && s.ApprovalStatus == ApprovalStatus.Draft);
        }
    }
}
