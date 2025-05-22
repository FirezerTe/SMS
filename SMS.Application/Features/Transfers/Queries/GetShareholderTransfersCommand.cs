

using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace SMS.Application;

public record GetShareholderTransfersCommand(int ShareholderId) : IRequest<List<TransferDto>>;

public class GetShareholderTransfersCommandHandler : IRequestHandler<GetShareholderTransfersCommand, List<TransferDto>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetShareholderTransfersCommandHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }
    public async Task<List<TransferDto>> Handle(GetShareholderTransfersCommand request, CancellationToken cancellationToken)
    {
        var response = new List<TransferDto>();

        var transfers = await dataService.Transfers.Where(t => t.FromShareholderId == request.ShareholderId)
                                                       .OrderByDescending(t => t.CreatedAt)
                                                       .AsNoTracking()
                                                       .ToListAsync();

        if (transfers.Count == 0) return response;

        var transferIds = transfers.Select(t => t.Id).ToList();
        var documents = await dataService.TransferDocuments.Where(t => transferIds.Contains(t.TransferId)).AsNoTracking().ToListAsync();

        var shareholderIds = transfers.Select(t => t.FromShareholderId)
                                        .Union(transfers.SelectMany(t => t.Transferees.Select(transferee => transferee.ShareholderId)))
                                        .ToList();


        var shareholders = await dataService.Shareholders.Where(s => shareholderIds.Contains(s.Id))
                                                         .ProjectTo<ShareholderBasicInfo>(mapper.ConfigurationProvider)
                                                         .AsNoTracking()
                                                         .ToListAsync();

        foreach (var transfer in transfers)
        {
            var result = mapper.Map<TransferDto>(transfer);
            result.TransferDocuments = documents.Where(d => d.TransferId == transfer.Id).ToList();

            decimal totalTransferredAmount = 0;
            foreach (var payment in transfer.Transferees.SelectMany(x => x.Payments))
            {
                totalTransferredAmount += payment.Amount;
            }

            result.TotalTransferredAmount = totalTransferredAmount;

            result.FromShareholder = shareholders.FirstOrDefault(s => s.Id == transfer.FromShareholderId);
            foreach (var transferee in result.Transferees)
            {
                transferee.Shareholder = shareholders.FirstOrDefault(s => s.Id == transferee.ShareholderId);
                transferee.TransferredAmount = transferee.Payments.Select(s => s.Amount).Sum();
            }

            response.Add(result);
        }


        return response;
    }
}