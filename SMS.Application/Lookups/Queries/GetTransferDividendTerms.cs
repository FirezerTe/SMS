using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Domain;


namespace SMS.Application.Lookups;

public record GetTransferDividendTermsQuery : IRequest<List<TransferDividendTerm>>;

public class GetTransferDividendTermsQueryHandler : IRequestHandler<GetTransferDividendTermsQuery, List<TransferDividendTerm>>
{
    private readonly IDataService dataService;
    private readonly IMapper mapper;

    public GetTransferDividendTermsQueryHandler(IDataService dataService, IMapper mapper)
    {
        this.dataService = dataService;
        this.mapper = mapper;
    }

    public async Task<List<TransferDividendTerm>> Handle(GetTransferDividendTermsQuery request, CancellationToken cancellationToken)
    {
        return await dataService.TransferDividendTerms.AsNoTracking().ToListAsync();
    }
}
