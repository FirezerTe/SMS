using FluentEmail.Liquid;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SMS.Domain;

namespace SMS.Application.Features.Notification.Commands
{
    public class CreateSMSNotificationCommand : IRequest
    {
        public SMSNotification Notification { get; set; }
    }


    public class CreateSMSNotificationCommandHandler : IRequestHandler<CreateSMSNotificationCommand>
    {
        private readonly IDataService dataService;
        private readonly IBackgroundJobScheduler backgroundJobService;
        private readonly ILogger<CreateSMSNotificationCommandHandler> logger;

        public CreateSMSNotificationCommandHandler(IDataService dataService,
            IBackgroundJobScheduler backgroundJobService,
            ILogger<CreateSMSNotificationCommandHandler> logger)
        {
            this.dataService = dataService;
            this.backgroundJobService = backgroundJobService;
            this.logger = logger;
        }

        public async Task Handle(CreateSMSNotificationCommand request, CancellationToken cancellationToken)
        {
            var sMSTemplate = await dataService.SMSTemplates.FirstOrDefaultAsync(t => t.SMSType == request.Notification.SMSType);

            if (sMSTemplate != null)
            {

                var renderer = new LiquidRenderer(Options.Create(new LiquidRendererOptions()));
                var body =
                    await
                    renderer
                    .ParseAsync
                    (sMSTemplate.Template, request.Notification.Model);



                var smsText = new SMSText()
                {
                    AlertId = request.Notification.AlertId,
                    Message = body,
                    MobileNumber = request.Notification.MobileNumber,
                    Sent = false,
                };

                dataService.SMSTexts.Add(smsText);

                await dataService.SaveAsync(cancellationToken);

                backgroundJobService.EnqueueSMS(smsText.Id);
            }
            else
            {
                logger.LogError("Unable to find SMS template for SMS Type:{SMSType}", request.Notification.SMSType);
            }

        }
    }
}