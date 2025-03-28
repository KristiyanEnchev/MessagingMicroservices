namespace Application.Interfaces.Identity
{
    using Models.Identity;

    using Shared;

    public interface ICookieService
    {
        Task<Result<string>> LoginWithCookie(UserRequestModel request);
        Task<Result<string>> LogoutCookie();
    }
}