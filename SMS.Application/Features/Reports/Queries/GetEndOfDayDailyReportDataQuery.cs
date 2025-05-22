using MediatR;
using Microsoft.EntityFrameworkCore;
using SMS.Application.Features.Reports.Dtos;
using SMS.Domain.Enums;

namespace SMS.Application.Features.Reports.Queries
{
    public class GetEndOfDayDailyReportDataQuery : IRequest<EndOfDayDailyReportDto>
    {
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
    }

    public class GetEndOfDayDailyReportDataQueryHandler : IRequestHandler<GetEndOfDayDailyReportDataQuery, EndOfDayDailyReportDto>
    {
        private readonly IDataService dataService;

        public GetEndOfDayDailyReportDataQueryHandler(IDataService dataService)
        {
            this.dataService = dataService;
        }
        public async Task<EndOfDayDailyReportDto> Handle(GetEndOfDayDailyReportDataQuery request, CancellationToken cancellationToken)
        {
            return new EndOfDayDailyReportDto
            {
                FromDate = request.FromDate,
                ToDate = request.ToDate,
                EndOfDayResponse = await GetDailyEodHeader(request),
                EndOfDayDetail = await GetDailyEodDetail(request)
            };
        }

        private async Task<List<EndOfDayResponseDto>> GetDailyEodHeader(GetEndOfDayDailyReportDataQuery request)
        {
            var endOfDaydailies = new List<EndOfDayResponseDto>();

            var searchEodHeader = await dataService.BatchPostingHeaders
                .Where(a => a.RubRespHeader_MDate >= request.FromDate && a.RubRespHeader_MDate <= request.ToDate
                 && a.RubRespHeader_PostingType == PostingType.EndOfDayPosting.ToString())
                .ToListAsync();
            foreach (var Header in searchEodHeader)
            {

                var endofdayDetails = new EndOfDayResponseDto
                {
                    ResponseCode = Header.RubRespHeader_RespCode,
                    IsSuccess = Header.RubRespHeader_Success,
                    ResponseMessage = Header.RubRespHeader_ResponseMessage,
                    BatchNumber = Header.RubRespHeader_BatchNo,
                    PostingDate = Header.RubRespHeader_MDate,
                    CreatedDate = DateOnly.FromDateTime(Header.CreatedAt.Value.Date)
                };

                endOfDaydailies.Add(endofdayDetails);

            }

            return endOfDaydailies;
        }

        private async Task<List<EndOfDayDetailDto>> GetDailyEodDetail(GetEndOfDayDailyReportDataQuery request)
        {
            var endOfDaydetail = new List<EndOfDayDetailDto>();

            var searchEodHeader = await dataService.BatchPostingHeaders
                .Where(a => a.RubRespHeader_MDate >= request.FromDate && a.RubRespHeader_MDate <= request.ToDate
                && a.RubRespHeader_PostingType == PostingType.EndOfDayPosting.ToString())
                .ToListAsync();
            foreach (var Header in searchEodHeader)
            {

                var searchEodDetail = await dataService.BatchPostingResponseDetails
               .Where(a => a.RubRespDetail_RubRespHeader == Header.RubRespHeader_BatchNo)
               .ToListAsync();

                for (int i = 0; i < searchEodDetail.Count; i++)
                {
                    var message = searchEodHeader.Where(a => a.RubRespHeader_BatchNo == searchEodDetail[i].RubRespDetail_RubRespHeader).FirstOrDefault();

                    var endofday = new EndOfDayDetailDto
                    {
                        Amount = searchEodDetail[i].RubRespDetail_Amount,
                        GLAccount = searchEodDetail[i].RubRespDetail_AccountNo,
                        TransactionType = searchEodDetail[i].RubRespDetail_TxnType,
                        ResponseMessage = message.RubRespHeader_ResponseMessage,
                        BatchNumber = searchEodDetail[i].RubRespDetail_RubRespHeader,
                        PostingDate = searchEodDetail[i].RubRespDetail_MDate,
                        IsSuccess = searchEodDetail[i].RubRespDetail_Success,
                    };
                    endOfDaydetail.Add(endofday);
                }

            }

            return endOfDaydetail;
        }
    }
}