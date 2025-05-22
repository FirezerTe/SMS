using FluentValidation;
using SMS.Domain.Enums;

namespace SMS.Application
{
    public class ApproveParValueCommandValidator : AbstractValidator<ApproveParValueCommand>
    {
        private readonly IDataService dataService;

        public ApproveParValueCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;
            RuleFor(p => p.Comment).NotEmpty().WithMessage("Comment is required for approval.");
            RuleFor(p => p)
                .Must(Exist)
                .WithMessage(x => $"Unable to find par value.");
            RuleFor(p => p)
                .Must(ShouldHaveDraftForApprovalStatus)
                .WithMessage(x => $"Cannot approve a unsubmitted record");
        }

        private bool Exist(ApproveParValueCommand command)
        {
            return dataService.ParValues.Any(s => s.Id == command.Id);
        }

        private bool ShouldHaveDraftForApprovalStatus(ApproveParValueCommand command)
        {
            return dataService.ParValues.Any(s => s.Id == command.Id && s.ApprovalStatus == ApprovalStatus.Submitted);
        }
    }
}
