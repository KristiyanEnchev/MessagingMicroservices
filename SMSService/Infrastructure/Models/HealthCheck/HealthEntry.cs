namespace Models.HealthCheck
{
    public class HealthEntry
    {
        public string? Name { get; set; } = null;
        public TimeSpan? Duration { get; set; }
        public string? Status { get; set; }
        public string? Exception { get; set; }
    }
}
