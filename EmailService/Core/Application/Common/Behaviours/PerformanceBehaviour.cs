namespace Application.Common.Behaviours
{
    using System.Diagnostics;

    using Microsoft.Extensions.Logging;

    using MediatR;

    using Application.Interfaces;

    public class PerformanceBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
    {
        private readonly Stopwatch _timer;
        private readonly ILogger<TRequest> _logger;
        private readonly IUser _user;

        public PerformanceBehaviour(ILogger<TRequest> logger, IUser user)
        {
            _logger = logger;
            _user = user;
            _timer = new Stopwatch();
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            _timer.Start();

            var response = await next();

            _timer.Stop();

            var elapsedMilliseconds = _timer.ElapsedMilliseconds;

            if (elapsedMilliseconds > 500)
            {
                var requestName = typeof(TRequest).Name;
                var userId = _user.Id ?? string.Empty;
                string? email = _user.Id;

                _logger.LogWarning("Email Service Long Running Request: {Name} ({ElapsedMilliseconds} milliseconds) {@UserId} {@Email} {@Request}",
                    requestName, elapsedMilliseconds, userId, email, request);
            }

            return response;
        }
    }
}