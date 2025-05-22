namespace SMS.Domain
{
    public class PaymentsWeightedAverage : IEntity
    {
        public int Id { get; set; }
        public int PaymentId { get; set; }
        public int ShareholderId { get; set; }
        public int DividendSetupId { get; set; }
        public decimal Amount { get; set; }
        public DateOnly EffectiveDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public int WorkingDays { get; set; }
        public decimal WeightedAverageAmt { get; set; }

        public Payment Payment { get; set; }
    }
}
