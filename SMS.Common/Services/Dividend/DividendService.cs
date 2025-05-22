using Microsoft.EntityFrameworkCore;
using SMS.Domain;
using SMS.Domain.Enums;

namespace SMS.Common;

public class DividendService : IDividendService
{
    private readonly IDataService dataService;
    private readonly IParValueService parValueService;

    public DividendService(IDataService dataService, IParValueService parValueService)
    {
        this.dataService = dataService;
        this.parValueService = parValueService;
    }

    private async Task ComputeDividendRate(int dividendSetupId, CancellationToken cancellationToken = default)
    {
        var setup = await dataService.DividendSetups.FirstOrDefaultAsync(s => s.Id == dividendSetupId);

        if (setup == null)
            throw new Exception("Unable to find dividend setup");

        if (setup.DividendRateComputationStatus != DividendRateComputationStatus.Computing || setup.DistributionStatus != DividendDistributionStatus.NotStarted)
        {
            setup.DistributionStatus = DividendDistributionStatus.NotStarted;
            setup.DividendRateComputationStatus = DividendRateComputationStatus.Computing;
            await dataService.SaveAsync(cancellationToken);
        }

        var dividendPeriod = await dataService.DividendPeriods.FirstOrDefaultAsync(p => p.Id == setup.DividendPeriodId);

        if (dividendPeriod == null)
            throw new Exception($"Unable to find dividend period (DividendPeriodId: {setup.DividendPeriodId})");

        var dividendStartDate = dividendPeriod.StartDate.ToDateTime(TimeOnly.Parse("00:00"));
        var dividendEndDate = dividendPeriod.EndDate.ToDateTime(TimeOnly.Parse("00:00")).AddDays(1);

        var existingWeightedAvr = await dataService.PaymentsWeightedAverages.Where(pw => pw.DividendSetupId == dividendSetupId).ToListAsync();

        if (existingWeightedAvr.Count > 0)
        {
            dataService.PaymentsWeightedAverages.RemoveRange(existingWeightedAvr);
            await dataService.SaveAsync(cancellationToken);
        }

        var shareholderPayments = await dataService.Payments
                                        .Where(p => p.ApprovalStatus == ApprovalStatus.Approved
                                                    && (p.EndDate == null || p.EndDate >= dividendStartDate)
                                                    && p.Subscription.Shareholder.ShareholderStatus == ShareholderStatusEnum.Active)
                                        .GroupBy(p => p.Subscription.ShareholderId)
                                        .Select(grp => new
                                        {
                                            ShareholderId = grp.Key,
                                            Payments = grp.Select(p => new { p.Id, p.Amount, p.EffectiveDate, p.EndDate })
                                        })
                                        .AsNoTracking()
                                        .ToListAsync();

        foreach (var shareholder in shareholderPayments)
        {
            foreach (var payment in shareholder.Payments)
            {
                if (payment == null) continue;

                int workingDays = 0;

                if (payment.EndDate != null && payment.EndDate < dividendEndDate)
                {
                    var referenceDate = payment.EffectiveDate > dividendStartDate ? payment.EffectiveDate : dividendStartDate;
                    workingDays = (int)(Convert.ToDateTime(payment.EndDate) - Convert.ToDateTime(referenceDate)).TotalDays;
                }
                else
                    workingDays = (int)(Convert.ToDateTime(dividendEndDate) - Convert.ToDateTime(payment.EffectiveDate)).TotalDays;

                workingDays = workingDays > dividendPeriod.DayCount ? dividendPeriod.DayCount : workingDays;

                if (workingDays > 0)
                {
                    var weightedAverage = new PaymentsWeightedAverage()
                    {
                        PaymentId = payment.Id,
                        ShareholderId = shareholder.ShareholderId,
                        Amount = payment.Amount,
                        DividendSetupId = dividendSetupId,
                        EffectiveDate = DateOnly.FromDateTime(payment.EffectiveDate),
                        EndDate = payment.EndDate != null ? DateOnly.FromDateTime(payment.EndDate.Value) : null,
                        WorkingDays = workingDays,
                        WeightedAverageAmt = payment.Amount * workingDays / dividendPeriod.DayCount
                    };

                    await dataService.PaymentsWeightedAverages.AddAsync(weightedAverage);
                }
            }
        }

        await dataService.SaveAsync(cancellationToken);

        var totalWeightedAvg = await dataService.PaymentsWeightedAverages
                              .Where(pw => pw.DividendSetupId == dividendSetupId)
                              .SumAsync(p => p.WeightedAverageAmt);

        var totalSubscriptionPayments = await dataService.PaymentsWeightedAverages
                             .Where(pw => pw.DividendSetupId == dividendSetupId)
                             .SumAsync(p => p.Amount);

        if (totalWeightedAvg > 0)
        {
            setup.DividendRate = setup.DeclaredAmount / totalWeightedAvg;
            setup.TotalWeightedAverageSubscriptionPayments = totalWeightedAvg;
            setup.TotalSubscriptionPayments = totalSubscriptionPayments;
        }

        setup.DividendRateComputationStatus = DividendRateComputationStatus.Completed;

        await dataService.SaveAsync(cancellationToken);

    }

    public async Task DistributeDividendToShareholders(int dividendSetupId, CancellationToken cancellationToken = default)
    {
        await ComputeDividendRate(dividendSetupId, cancellationToken);

        var setup = await dataService.DividendSetups.FirstOrDefaultAsync(s => s.Id == dividendSetupId);

        if (setup == null)
        {
            throw new Exception("Unable to find dividend setup");
        }



        if (setup.DistributionStatus != DividendDistributionStatus.Started)
        {
            setup.DistributionStatus = DividendDistributionStatus.Started;
            await dataService.SaveAsync(cancellationToken);
        }

        await dataService.Dividends.Where(d => d.DividendSetupId == dividendSetupId).ExecuteDeleteAsync();

        var shareholderPayments = await dataService.PaymentsWeightedAverages
                                                    .Where(p => p.DividendSetupId == dividendSetupId)
                                                    .GroupBy(p => p.ShareholderId)
                                                    .Select(grp => new
                                                    {
                                                        ShareholderId = grp.Key,
                                                        totalPaidAmount = grp.Sum(p => p.Amount),
                                                        totalWeightedPaidAmount = grp.Sum(p => p.WeightedAverageAmt)
                                                    })
                                                    .AsNoTracking()
                                                    .ToListAsync();

        foreach (var shareholder in shareholderPayments)
        {
            var dividendDecision = new DividendDecision()
            {
                DecisionDate = null,
                Decision = DividendDecisionType.Pending,
                CapitalizedAmount = 0,
                FulfillmentPayment = 0,
                Tax = 0,
                DecisionProcessed = false,
                TaxProcessed = false,
                BranchId = null,
                DistrictId = null
            };

            var dividend = new Dividend()
            {
                ShareholderId = shareholder.ShareholderId,
                DividendSetupId = dividendSetupId,
                TotalPaidAmount = shareholder.totalPaidAmount,
                TotalPaidWeightedAverage = shareholder.totalWeightedPaidAmount,
                DividendAmount = shareholder.totalWeightedPaidAmount * setup.DividendRate,
                DividendDecision = dividendDecision
            };

            dataService.Dividends.Add(dividend);
        }

        await dataService.SaveAsync(cancellationToken);
        await ComputeCapitalizationLimit();
        setup.DistributionStatus = DividendDistributionStatus.Completed;
        await dataService.SaveAsync(cancellationToken);

    }

    public async Task ComputeCapitalizationLimit()
    {
        var currentParValue = await parValueService.GetCurrentParValue();

        if (currentParValue == null)
            throw new Exception("Unable to find current par value");

        var dividendAllocation = await dataService.Allocations.FirstOrDefaultAsync(c => c.IsDividendAllocation);
        if (dividendAllocation == null) return;

        var totalCapitalized = await dataService.DividendDecisions.Select(x => x.CapitalizedAmount + x.FulfillmentPayment).SumAsync();

        var netAvailableAllocation = dividendAllocation.Amount - totalCapitalized;


        var totalPending = await dataService.DividendDecisions.Where(x => x.Decision == DividendDecisionType.Pending).Select(d => d.Dividend.DividendAmount - d.Tax).SumAsync();

        var pendingDividendIds = await dataService.DividendDecisions.Where(x => x.Decision == DividendDecisionType.Pending).Select(x => x.Dividend.Id).ToListAsync();

        var ratio = Math.Min(netAvailableAllocation, totalPending) / (totalPending == 0 ? 1 : totalPending);
        _ = await dataService.Dividends.Where(x => pendingDividendIds.Contains(x.Id))
                                       .Select(d => new { Dividend = d, d.DividendDecision!.Tax })
                                       .ExecuteUpdateAsync(s => s.SetProperty(p => p.Dividend.CapitalizeLimit,
                                                                              p => Math.Ceiling((p.Dividend.DividendAmount - p.Tax) * ratio / (currentParValue.Amount == 0 ? 1 : currentParValue.Amount)) * currentParValue.Amount));
    }
    public async Task<DividendPeriod?> GetCurrentDividendPeriod()
    {
        var today = DateOnly.FromDateTime(DateTime.Now);

        return await dataService.DividendPeriods.Include(x => x.DividendSetup)
                                                .FirstOrDefaultAsync(x => x.StartDate <= today && x.EndDate >= today);

    }

    public async Task<DividendComputationResults> ComputeDividendDecision(List<int> dividendIds, decimal amountToCapitalize)
    {
        var currentParValue = await parValueService.GetCurrentParValue();

        if (currentParValue == null)
            throw new Exception("Unable to find current par value");


        var dividendDecisions = await dataService.DividendDecisions.Include(d => d.Dividend)
                                                                   .ThenInclude(d => d.DividendSetup)
                                                                   .Where(d => dividendIds.Contains(d.Id))
                                                                   .OrderByDescending(d => d.Dividend.DividendSetup.DividendPeriod.EndDate)
                                                                   .ToListAsync();

        decimal totalCapitalized = 0;
        decimal totalWithdrawn = 0;
        decimal totalTax = 0;
        decimal totalNetPay = 0;
        decimal totalFulfillment = 0;
        decimal totalDividends = dividendDecisions.Sum(d => d.Dividend.DividendAmount);


        var evaluationResult = new List<DividendComputationResult>();
        foreach (var decision in dividendDecisions)
        {
            if (decision.DecisionProcessed) continue;

            var remaining = amountToCapitalize - totalCapitalized;

            var tax = decision.TaxApplied ? decision.Tax : 0;
            if (!decision.TaxApplied)
            {
                if (remaining < decision.Dividend.DividendAmount)
                {
                    tax = (decision.Dividend.DividendAmount - remaining) * decision.Dividend.DividendSetup.TaxRate / 100;
                }
            }

            var netAvailableToCapitalize = Math.Min(decision.Dividend.DividendAmount - tax, decision.Dividend.CapitalizeLimit);

            var amountToCapitalize_ = Math.Min(remaining, netAvailableToCapitalize);

            DividendDecisionType decisionType = amountToCapitalize_ == (decision.Dividend.DividendAmount - tax)
                                                    ? DividendDecisionType.FullyCapitalize
                                                    : amountToCapitalize_ == 0
                                                        ? DividendDecisionType.FullyPay
                                                        : DividendDecisionType.PartiallyCapitalize;

            totalCapitalized += amountToCapitalize_;

            var withdrawnAmount = decision.Dividend.DividendAmount - amountToCapitalize_;
            var netPay = withdrawnAmount - tax;


            evaluationResult.Add(new DividendComputationResult()
            {
                Id = decision.Id,
                Decision = decisionType,
                CapitalizedAmount = amountToCapitalize_,
                FulfillmentAmount = 0,
                WithdrawnAmount = withdrawnAmount,
                NetPay = netPay,
                Tax = tax
            });

            totalWithdrawn += withdrawnAmount;
            totalTax += tax;
            totalNetPay += netPay;
        }

        var fulfillment = Math.Ceiling(totalCapitalized / (currentParValue.Amount == 0 ? 1 : currentParValue.Amount)) * currentParValue.Amount - totalCapitalized;

        if (fulfillment > 0)
        {
            var lastCapitalizedDecision = evaluationResult.Where(x => x.Decision != DividendDecisionType.FullyPay).LastOrDefault();
            if (lastCapitalizedDecision != null)
            {

                lastCapitalizedDecision.FulfillmentAmount = fulfillment;
                totalFulfillment += fulfillment;
            }

        }

        // evaluationResult.Reverse();
        return new DividendComputationResults
        {
            Results = evaluationResult,
            TotalDividends = totalDividends,
            TotalCapitalized = totalCapitalized,
            TotalWithdrawn = totalWithdrawn,
            TotalTax = totalTax,
            TotalNetPay = totalNetPay,
            TotalFulfillment = totalFulfillment,

        };
    }
}

