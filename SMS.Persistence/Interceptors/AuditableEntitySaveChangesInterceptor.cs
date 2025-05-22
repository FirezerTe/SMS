using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

using SMS.Domain;
using SMS.Domain.Enums;
using SMS.Domain.Common;
using SMS.Common;

namespace SMS.Persistence.Interceptors
{
    public class AuditableEntitySaveChangesInterceptor : SaveChangesInterceptor
    {
        private readonly IUserService userService;

        public AuditableEntitySaveChangesInterceptor(IUserService userService)
        {
            this.userService = userService;
        }

        public override InterceptionResult<int> SavingChanges(
            DbContextEventData eventData, InterceptionResult<int> result)
        {
            var now = DateTime.Now;
            HandleWorkflowEntityChange(eventData.Context, now);
            SetAuditFields(eventData.Context, now);
            return base.SavingChanges(eventData, result);
        }

        public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(
            DbContextEventData eventData,
            InterceptionResult<int> result,
            CancellationToken cancellationToken = default)
        {
            var now = DateTime.Now;
            HandleWorkflowEntityChange(eventData.Context, now);
            HandleWorkflowEntityVersionNumber(eventData.Context);
            SetAuditFields(eventData.Context, now);

            return await base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        private void SetAuditFields(DbContext? context, DateTime now)
        {
            if (context == null) return;

            var loggedInUserId = userService.GetCurrentUserId();

            foreach (var entry in context.ChangeTracker.Entries<AuditableEntity>())
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedBy = loggedInUserId;
                    entry.Entity.CreatedAt = now;
                }

                if (entry.State == EntityState.Modified)
                {
                    entry.Entity.ModifiedBy = loggedInUserId;
                    entry.Entity.ModifiedAt = now;
                }
            }

            foreach (var entry in context.ChangeTracker.Entries<AuditableSoftDeleteEntity>())
            {
                if (entry.State == EntityState.Deleted)
                {
                    entry.State = EntityState.Modified;
                    entry.Entity.IsDeleted = true;
                    entry.Entity.DeletedBy = loggedInUserId;
                    entry.Entity.DeletedAt = now;
                }
            }
        }

        private void HandleWorkflowEntityVersionNumber(DbContext? context)
        {
            if (context == null) return;

            foreach (var entry in context.ChangeTracker.Entries<WorkflowEnabledEntity>())
            {
                if (entry.State == EntityState.Added || entry.State == EntityState.Modified)
                    entry.Entity.VersionNumber = Guid.NewGuid();
            }
        }

        private void HandleWorkflowEntityChange(DbContext? context, DateTime now)
        {
            if (context == null) return;

            var loggedInUserId = userService.GetCurrentUserId();

            foreach (var entry in context.ChangeTracker.Entries<WorkflowEnabledEntity>())
            {
                //if (entry.State == EntityState.Added || entry.State == EntityState.Modified)
                //    entry.Entity.VersionNumber = Guid.NewGuid();


                if (entry.State == EntityState.Modified)
                {
                    var appStatusProp = entry.Properties.FirstOrDefault(p => p.Metadata.Name == "ApprovalStatus");
                    if (appStatusProp != null)
                    {
                        var currentApprovalStatus = (ApprovalStatus?)appStatusProp.CurrentValue;
                        var previousApprovalStatus = (ApprovalStatus?)appStatusProp.OriginalValue;

                        // if (previousApprovalStatus == null || currentApprovalStatus == null)
                        // {
                        //     entry.Entity.ApprovalStatus = ApprovalStatus.Draft;
                        // }
                        // if (previousApprovalStatus == null || currentApprovalStatus == null)
                        // {
                        //     entry.Entity.ApprovalStatus = ApprovalStatus.Draft;
                        // }

                        if (
                            !entry.Entity.SkipStateTransitionCheck &&
                            (previousApprovalStatus == ApprovalStatus.Approved ||
                            previousApprovalStatus == ApprovalStatus.Rejected ||
                            (previousApprovalStatus == ApprovalStatus.Submitted && !(currentApprovalStatus == ApprovalStatus.Approved || currentApprovalStatus == ApprovalStatus.Rejected))))
                        {
                            entry.Entity.ApprovalStatus = ApprovalStatus.Draft;
                        }

                        if (previousApprovalStatus == null || entry.Properties.Any(p => p.Metadata.Name == "ApprovalStatus" && p.IsModified))
                        {


                            switch (entry.Entity.ApprovalStatus)
                            {
                                case ApprovalStatus.Submitted:
                                    entry.Entity.SubmittedBy = loggedInUserId;
                                    entry.Entity.SubmittedAt = now;
                                    break;
                                case ApprovalStatus.Approved:
                                    entry.Entity.ApprovedBy = loggedInUserId;
                                    entry.Entity.ApprovedAt = now;
                                    break;
                                case ApprovalStatus.Rejected:
                                    entry.Entity.RejectedBy = loggedInUserId;
                                    entry.Entity.RejectedAt = now;
                                    break;
                            }
                        }
                    }

                }
            }
        }
    }
}
