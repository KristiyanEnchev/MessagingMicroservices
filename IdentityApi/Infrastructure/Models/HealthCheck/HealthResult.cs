namespace Models.HealthCheck
{
    public class HealthResult
    {
        public string? Status { get; set; }
        public int TotalChecks { get; set; }
        public List<HealthEntry>? Entries { get; set; }
    }
}
