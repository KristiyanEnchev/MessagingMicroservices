namespace Application
{
    using System.Reflection;

    using Microsoft.Extensions.DependencyInjection;

    using FluentValidation;

    using Application.Common.Mappings;
    using Application.Common.Behaviours;

    using MediatR;

    using Models.Account;

    public static class Startup
    {
        public static void AddApplication(this IServiceCollection services)
        {
            services.AddAutoMapper();
            services.AddValidators();
            services.AddMediator();
        }

        private static void AddAutoMapper(this IServiceCollection services)
        {
            services.AddAutoMapper(
                typeof(MappingProfile).Assembly,
                typeof(UserActivityModel).Assembly
            );
            services.AddTransient<AutoMapperConfigurationValidator>();
        }

        private static void AddValidators(this IServiceCollection services)
        {
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        }

        private static void AddMediator(this IServiceCollection services)
        {
            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
                cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
                cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));
            });
        }
    }
}
