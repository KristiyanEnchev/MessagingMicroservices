namespace Web.Extentions.Hangfire
{
    using Microsoft.Extensions.DependencyInjection;

    using global::Hangfire;
    using global::Hangfire.Server;
    using Microsoft.AspNetCore.Http;
    using Serilog;

    public class MailingJobActivator : JobActivator
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public MailingJobActivator(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory ?? throw new ArgumentNullException(nameof(scopeFactory));
        }

        public override JobActivatorScope BeginScope(PerformContext context)
        {
            var scope = _scopeFactory.CreateScope();
            return new SimpleScope(scope.ServiceProvider);
        }

        private class SimpleScope : JobActivatorScope
        {
            private readonly IServiceProvider _serviceProvider;

            public SimpleScope(IServiceProvider serviceProvider)
            {
                _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
            }

            public override object Resolve(Type type)
            {
                try
                {
                    var service = _serviceProvider.GetService(type);
                    if (service != null)
                    {
                        return service;
                    }

                    var interfaceType = type.GetInterfaces().FirstOrDefault();
                    if (interfaceType != null)
                    {
                        return _serviceProvider.GetService(type) ??
                            throw new InvalidOperationException($"Requested service of type {type.Name} was not found.");
                    }

                    throw new InvalidOperationException($"Requested service or interface of type {type.Name} was not found");
                }
                catch (Exception ex)
                {
                    using var scope = _serviceProvider.CreateScope();
                    var httpContext = scope.ServiceProvider.GetRequiredService<IHttpContextAccessor>()?.HttpContext;
                    Log.Error($"Error resolving service or interface of type {type.Name}: {ex.Message}");
                    throw;
                }
            }
        }
    }
}
