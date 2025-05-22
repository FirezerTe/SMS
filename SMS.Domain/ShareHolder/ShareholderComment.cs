namespace SMS.Domain
{
    public class ShareholderComment
    {
        public int Id { get; set; }
        public int ShareholderId { get; set; }
        public string CommentType { get; set; }
        public string CommentedByUserId { get; set; }

        public string CommentedBy { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;

        public Shareholder Shareholder { get; set; }
    }
}
