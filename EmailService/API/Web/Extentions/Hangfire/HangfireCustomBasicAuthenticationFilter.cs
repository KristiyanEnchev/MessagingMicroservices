namespace Web.Extensions.Hangfire
{
    using System;
    using System.Text;

    using Microsoft.AspNetCore.Http;

    using global::Hangfire.Dashboard;

    public class HangfireCustomBasicAuthenticationFilter : IDashboardAuthorizationFilter
    {
        public string Username { get; set; }
        public string Password { get; set; }

        public HangfireCustomBasicAuthenticationFilter(string username, string password)
        {
            Username = username ?? throw new ArgumentNullException(nameof(username));
            Password = password ?? throw new ArgumentNullException(nameof(password));
        }

        public bool Authorize(DashboardContext context)
        {
            var httpContext = context.GetHttpContext();
            string authHeader = httpContext.Request.Headers["Authorization"];

            if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
            {
                return Challenge(httpContext);
            }

            string encodedCredentials = authHeader["Basic ".Length..].Trim();
            var credentials = Encoding.UTF8.GetString(Convert.FromBase64String(encodedCredentials)).Split(':');
            if (credentials.Length != 2)
            {
                return Challenge(httpContext);
            }

            bool isAuthenticated = credentials[0] == Username && credentials[1] == Password;
            if (!isAuthenticated)
            {
                return Challenge(httpContext);
            }

            return true;
        }

        private bool Challenge(HttpContext httpContext)
        {
            httpContext.Response.Headers["WWW-Authenticate"] = "Basic realm=\"Hangfire Dashboard\"";
            httpContext.Response.StatusCode = 401;
            return false;
        }
    }
}