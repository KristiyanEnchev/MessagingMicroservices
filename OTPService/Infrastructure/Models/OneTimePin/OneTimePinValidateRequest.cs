namespace Models.OneTimePin
{
    public class OneTimePinValidateRequest
    {
        public string? Identifier { get; set; }
        public string? TransactionId { get; set; }
        public string? Otp { get; set; }
    }
}