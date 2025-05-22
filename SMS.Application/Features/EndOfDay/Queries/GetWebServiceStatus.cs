using MediatR;
using SMS.Common.Services.RigsWeb;

namespace SMS.Application.Features.EndOfDay.Queries
{
    public class GetWebServiceStatus : IRequest<bool>
    {
    }
    public class GetWebServiceStatusHandler : IRequestHandler<GetWebServiceStatus, bool>
    {
        private readonly IRigsWebService rigsWebService;

        public GetWebServiceStatusHandler(IRigsWebService rigsWebService)
        {

            this.rigsWebService = rigsWebService;

        }
        public async Task<bool> Handle(GetWebServiceStatus request, CancellationToken cancellationToken)
        {
            var isWebRunning = await rigsWebService.IsWebServiceRunning();
            if (isWebRunning == true)
            {
                return true;
            }

            return false;
        }
    }
}
