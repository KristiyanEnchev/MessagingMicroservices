namespace Models.Identity
{
    using System;
    using System.Text.Json.Serialization;

    public class UserResponseModel
    {
        public UserResponseModel(
            string accessToken,
            DateTime expiryTime,
            string refreshToken,
            bool requires2FA = false)
        {
            AccessToken = accessToken;
            RefreshToken = refreshToken;
            ExpiryTime = expiryTime;
            ExpiresIn = accessToken != null ? (int)(expiryTime - DateTime.UtcNow).TotalSeconds : 0;
            Requires2FA = requires2FA;
        }

        [JsonPropertyName("access_token")]
        public string AccessToken { get; }

        [JsonPropertyName("token_type")]
        public string TokenType { get; } = "Bearer";

        [JsonPropertyName("refresh_token")]
        public string RefreshToken { get; }

        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; }

        [JsonPropertyName("expires_at")]
        public DateTime ExpiryTime { get; }

        [JsonPropertyName("requires_2fa")]
        public bool Requires2FA { get; }

        [JsonIgnore]
        public bool IsSuccess => !string.IsNullOrEmpty(AccessToken) || Requires2FA;
    }
}