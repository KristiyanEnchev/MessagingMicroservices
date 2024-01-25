namespace Infrastructure
{
    using System.Net;
    using System.Text;

    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.IdentityModel.Tokens;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.AspNetCore.Authentication.JwtBearer;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    using MediatR;

    using Application.Interfaces;

    using Domain.Common;
    using Domain.Entities.Identity;
    using Domain.Common.Interfaces;

    using Infrastructure.Services;
    using Infrastructure.Identity.Services;
    using Infrastructure.Account.Services;

    using Persistence.Contexts;
    using Persistence.Constants;

    using Models;

    public static class Startup
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddServices()
                .AddConfigurations(configuration);

            return services;
        }

        private static IServiceCollection AddServices(this IServiceCollection services)
        {
            services
                .AddTransient<IMediator, Mediator>();

            return services;
        }

       
        private static IServiceCollection AddConfigurations(this IServiceCollection services, IConfiguration configuration)
        {
            return services;
        }
    }
}