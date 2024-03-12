namespace Models.OneTimePin
{
    public class OneTimePassword
    {
        public string? OtpId { get; set; }
        public string? Otp { get; set; }
        public string? Username { get; set; }
        public DateTime ExpiryTime { get; set; }
    }
}
