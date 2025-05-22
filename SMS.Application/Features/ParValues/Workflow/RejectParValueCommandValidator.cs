using FluentValidation;
using SMS.Domain.Enums;

namespace SMS.Application
{
    public class RejectParValueCommandValidator : AbstractValidator<RejectParValueCommand>
    {
        private readonly IDataService dataService;

        public RejectParValueCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            RuleFor(p => p.Comment).NotEmpty().WithMessage("Comment is required for approval.");
            RuleFor(p => p)
                .Must(Exist)
                .WithMessage(x => $"Unable to find par value.");
            RuleFor(p => p)
                .Must(ShouldHaveDraftForApprovalStatus)
                .WithMessage(x => $"Cannot reject a unsubmitted record");
        }

        private bool Exist(RejectParValueCommand command)
        {
            return dataService.ParValues.Any(s => s.Id == command.Id);
        }

        private bool ShouldHaveDraftForApprovalStatus(RejectParValueCommand command)
        {
            return dataService.ParValues.Any(s => s.Id == command.Id && s.ApprovalStatus == ApprovalStatus.Submitted);
        }
    }
}
