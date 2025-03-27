namespace Application.Handlers.Identity.Commands.Cookie
{
    using Application.Interfaces.Identity;

    using Models.Identity;

    using MediatR;

    using Shared;

    public class CookieLoginComand : UserRequestModel, IRequest<Result<string>>
    {
        public CookieLoginComand(string email, string password, bool rememberMe)
            : base(email, password, rememberMe)
        {
        }

        public class CookieLoginComandHandler : IRequestHandler<CookieLoginComand, Result<string>>
        {
            private readonly ICookieService _cookieService;

            public CookieLoginComandHandler(ICookieService identity)
            {
                _cookieService = identity;
            }

            public async Task<Result<string>> Handle(CookieLoginComand request, CancellationToken cancellationToken)
            {
                var result = await _cookieService.LoginWithCookie(request);

                return result;
            }
        }
    }
}
