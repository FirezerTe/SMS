using AutoMapper;
using MediatR;

using SMS.Domain;

namespace SMS.Application
{
    public class CreateShareholderCommandHandler : IRequestHandler<CreateShareholderCommand, int>
    {
        private readonly IMapper mapper;
        private readonly IDataService dataService;

        public CreateShareholderCommandHandler(IMapper mapper, IDataService dataService)
        {
            this.mapper = mapper;
            this.dataService = dataService;
        }

        public Task<int> Handle(CreateShareholderCommand request, CancellationToken cancellationToken)
        {

            var shareholder = mapper.Map<Shareholder>(request);
            dataService.Shareholders.Add(shareholder);

            dataService.Save();

            return Task.FromResult(shareholder.Id);
        }
    }
}
