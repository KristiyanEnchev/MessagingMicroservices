namespace Models.OneTimePin
{
    public class OneTimePinGenerateRequet
    {
        public string? Identifier { get; set; }
        public int? ExpirationMinutes { get; set; }
    }
}