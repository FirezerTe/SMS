using SMS.Domain.Enums;

namespace SMS.Domain.BatchReferenceDescription
{
    public class BatchReferenceDescription
    {
        public Guid Id { get; set; }
        public BatchDescriptionEnum Value { get; set; }
        public string Description { get; set; }

    }
}
