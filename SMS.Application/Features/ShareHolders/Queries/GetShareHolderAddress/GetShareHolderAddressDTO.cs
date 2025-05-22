namespace SMS.Application.Features.ShareHolders
{
    public class GetShareHolderAddressDTO
    {
        public int Id { get; set; }
        public int ShareHolderID { get; set; }
        public int HouseNo { get; set; }
        public ShareHolderVm ShareHolder { get; set; }
    }
}
