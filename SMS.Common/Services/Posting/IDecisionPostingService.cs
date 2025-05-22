namespace SMS.Common.Services.Posting
{
    public interface IDecisionPostingService
    {
        Task<bool> DecisionPostingCompute(List<int> decisionId);
    }
}