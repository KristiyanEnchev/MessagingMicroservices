namespace Web.Services
{
    using System.Security.Claims;

    using Microsoft.AspNetCore.Http;
    using Microsoft.IdentityModel.JsonWebTokens;

    using Application.Interfaces;

    using Persistence.Constants;

    public class CurrentUser : IUser
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUser(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? Id => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        public string? Email => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);
        public bool IsInRole(string role) =>
            _httpContextAccessor.HttpContext?.User?.FindFirstValue("role")?.Contains(role) ?? false;
        public bool IsAdmin => IsInRole(Roles.Administrator);
    }
}