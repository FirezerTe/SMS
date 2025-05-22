using Microsoft.AspNetCore.Http;
using SMS.Domain;

namespace SMS.Application
{
    public interface IDocumentUploadService
    {
        Task<Document> Upload(IFormFile file, CancellationToken cancellationToken);
        Task Delete(int id, CancellationToken cancellationToken);
    }
}
