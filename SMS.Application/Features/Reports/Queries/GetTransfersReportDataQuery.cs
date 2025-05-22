using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;


namespace SMS.Application.Features.Reports
{
    public class TransfereeInfo
    {
        public decimal Amount { get; set; }
        public string ShareholderId { get; set; }
        public ICollection<TransferredPayment> Payments { get; set; } = new List<TransferredPayment>();
    }
    public class GetTransfersReportDataQuery : IRequest<TransfersReportDto>
    {
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
    }

    public class GetTransfersReportDataQueryHandler :
        IRequestHandler<GetTransfersReportDataQuery, TransfersReportDto>
    {
        private readonly IDataService dataService;
        private readonly IMapper mapper;
        public GetTransfersReportDataQueryHandler(IDataService dataService, IMapper mapper)
        {
            this.dataService = dataService;
            this.mapper = mapper;
        }

        public async Task<TransfersReportDto> Handle(GetTransfersReportDataQuery request, CancellationToken cancellationToken)
        {
            var transfersList = await GetTransfers(request);
            var totalTransfer = transfersList.Sum(tr => tr.Amount);
            var totalShare = Convert.ToInt16(totalTransfer / 1000);
            return new TransfersReportDto
            {
                FromDate = request.FromDate.ToString("dd MMMM yyyy"),
                ToDate = request.ToDate.ToString("dd MMMM yyyy"),
                TotalTransferAmount = totalTransfer,
                TotalShare = totalShare,
                Transfers = transfersList
            };
        }

        private async Task<List<TransferDto>> GetTransfers(GetTransfersReportDataQuery request)
        {
            var transfers = new List<TransferDto>();
            var shareholderList = await dataService.Shareholders.ToListAsync();

            var transfersList = await dataService.Transfers.Where(tr => tr.AgreementDate > request.FromDate
                && tr.AgreementDate < request.ToDate && tr.ApprovalStatus == Domain.Enums.ApprovalStatus.Approved).ToListAsync();

            if (transfersList != null)
            {
                foreach (var transfer in transfersList)
                {
                    var transferee = transfer.Transferees.ToList();
                    var transferorSh = shareholderList.Where(sh => sh.Id == transfer.FromShareholderId).FirstOrDefault();
                    //var transfereeList = mapper.Map<TransfereeInfo>(transferee);
                    if (transferee != null)
                    {
                        foreach (var transfereeinfo in transferee)
                        {
                            var transfereeSh = shareholderList.Where(sh => sh.Id == Convert.ToInt16(transfereeinfo.ShareholderId)).FirstOrDefault();

                            var trans = new TransferDto
                            {
                                FromShareholderId = transfer.FromShareholderId,
                                FromShareholderName = transferorSh.DisplayName,
                                ToShareholderId = transfereeSh.ShareholderNumber,
                                ToShareholderName = transfereeSh.DisplayName,
                                Amount = transfereeinfo.Amount,
                                NumberOfShares = Convert.ToInt16(transfereeinfo.Amount / 1000),
                                TransferDate = transfer.AgreementDate.ToString("dd MMMM yyyy"),
                                TransferType = transfer.TransferType.ToString(),
                                DividendTerm = transfer.DividendTerm.ToString(),
                            };
                            transfers.Add(trans);
                        }

                    }
                }
            }
            return transfers;
        }

    }
}
