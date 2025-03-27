namespace Models.Settings.Post
{
    public class OtpSettings
    {
        public string ApiBaseUrl { get; set; }
        public string ApiKey { get; set; }
        public int OtpExpiryInMinutes { get; set; } = 2;
        public string GeneratePath { get; set; }
        public string ValidatePath { get; set; }
    }
}
