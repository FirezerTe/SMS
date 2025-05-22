using MediatR;
using SMS.Common.Services.RigsWeb;

namespace SMS.Application.Features.EndOfDay.Queries
{
    public class GetAccountNumberInfo : IRequest<RigsTransaction>
    {
        public string? AccountNumber;
    }
    public class GetAccountNumberInfoHandler : IRequestHandler<GetAccountNumberInfo, RigsTransaction>
    {
        private readonly IRigsWebService rigsWebService;

        public GetAccountNumberInfoHandler(IRigsWebService rigsWebService)
        {

            this.rigsWebService = rigsWebService;

        }
        public async Task<RigsTransaction> Handle(GetAccountNumberInfo request, CancellationToken cancellationToken)
        {
            var ValidateAccount = await rigsWebService.GetAccountInfo(request.AccountNumber);

            return ValidateAccount;
        }
    }
}