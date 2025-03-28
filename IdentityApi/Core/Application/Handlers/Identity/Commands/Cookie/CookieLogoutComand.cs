namespace Application.Handlers.Identity.Commands.Cookie
{
    using Application.Interfaces.Identity;

    using MediatR;

    using Models.Identity;

    using Shared;

    public class CookieLogoutComand : UserLogoutModel, IRequest<Result<string>>
    {
        public CookieLogoutComand(string email)
            : base(email)
        {
        }

        public class CookieLogoutComandHandler : IRequestHandler<CookieLogoutComand, Result<string>>
        {
            private readonly ICookieService _cookieService;

            public CookieLogoutComandHandler(ICookieService identity)
            {
                _cookieService = identity;
            }

            public async Task<Result<string>> Handle(CookieLogoutComand request, CancellationToken cancellationToken)
            {
                var result = await _cookieService.LogoutCookie();

                return result;
            }
        }
    }
}
