namespace Infrastructure.Services
{
    using Microsoft.AspNetCore.Http;

    using Application.Interfaces;

    public class IpAddressService : IIpAddressService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IpAddressService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetCurrentIpAddress()
        {
            var context = _httpContextAccessor?.HttpContext;
            if (context == null) return "system";

            var forwardedIp = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (!string.IsNullOrEmpty(forwardedIp))
            {
                return forwardedIp.Split(',')[0].Trim();
            }

            return context.Connection.RemoteIpAddress?.MapToIPv4().ToString() ?? "unknown";
        }

        public string GetOriginFromRequest()
        {
            var context = _httpContextAccessor?.HttpContext;

            string protocol = context!.Request.Headers["X-Forwarded-Proto"]!;
            string prefix = context.Request.Headers["X-Forwarded-Prefix"]!;

            if (string.IsNullOrEmpty(protocol) || string.IsNullOrEmpty(prefix))
            {
                return $"{context.Request.Scheme}://{context.Request.Host.Value}{context.Request.PathBase.Value}";
            }

            return $"{protocol}://{context.Request.Host.Value}/{prefix}{context.Request.PathBase.Value}";
        }

        public string? GetIpAddress() 
        {
            var context = _httpContextAccessor?.HttpContext;

            if (context == null) return null;

            return context.Request.Headers.ContainsKey("X-Forwarded-For")
                ? context.Request.Headers["X-Forwarded-For"]
                : context.Connection.RemoteIpAddress?.MapToIPv4().ToString() ?? "N/A";
        }
            
    }
}
