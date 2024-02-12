namespace Web.Extentions.MediatoR
{
    using Microsoft.Extensions.DependencyInjection;

    using MediatR;

    public class MediatorHangfireBridge
    {
        private readonly IServiceProvider _serviceProvider;

        public MediatorHangfireBridge(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task Send(IRequest command)
        {
            using var scope = _serviceProvider.CreateScope();
            var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();
            await mediator.Send(command);
        }

        public async Task<T> Send<T>(IRequest<T> command) where T : class
        {
            using var scope = _serviceProvider.CreateScope();
            var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();
            return await mediator.Send(command);
        }
    }
}
