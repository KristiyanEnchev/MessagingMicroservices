namespace Web.Extentions.Hangfire
{
    using Microsoft.Extensions.DependencyInjection;

    using global::Hangfire;
    using global::Hangfire.Server;

    public class SmsJobActivator : JobActivator
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public SmsJobActivator(IServiceScopeFactory scopeFactory)
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
                return _serviceProvider.GetService(type) ??
                       throw new InvalidOperationException($"Requested service of type {type.Name} was not found.");
            }
        }
    }
}
