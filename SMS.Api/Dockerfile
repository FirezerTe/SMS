FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["SMS.Api/SMS.Api.csproj", "SMS.Api/"]
COPY ["SMS.Application/SMS.Application.csproj", "SMS.Application/"]
COPY ["SMS.Domain/SMS.Domain.csproj", "SMS.Domain/"]
COPY ["SMS.Infrastructure/SMS.Infrastructure.csproj", "SMS.Infrastructure/"]
COPY ["SMS.Persistence/SMS.Persistence.csproj", "SMS.Persistence/"]
RUN dotnet restore "SMS.Api/SMS.Api.csproj"
COPY . .
WORKDIR "/src/SMS.Api"
RUN dotnet publish "SMS.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SMS.Api.dll"]
