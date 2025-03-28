namespace Models.Identity
{
    public class TwoFactorCodeResult
    {
        public string TransactionId { get; set; } = default!;
        public string? Message { get; set; }
    }
}