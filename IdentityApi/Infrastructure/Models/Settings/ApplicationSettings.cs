namespace Models.Settings
{
    public class ApplicationSettings
    {
        public int RefreshTokenExpirationInDays { get; set; } = 7;
        public int AccessTokenExpirationInMinutes { get; set; } = 60;
        public string LoginProvider { get; set; } = "IdentityApi";
        public TokenNames TokenNames { get; set; } = new TokenNames();

        public string Issuer { get; set; } = "http://localhost:8080";
        public string Audience { get; set; } = "urn:qa/identity";
        public int RsaKeyExpirationInDays { get; set; } = 30;
        public bool UseMicroservices { get; set; } = false;
    }

    public class TokenNames
    {
        public string AccessToken { get; set; } = "access_token";
        public string RefreshToken { get; set; } = "refresh_token";
    }
}