namespace Infrastructure.Services
{
    using Application.Interfaces;

    public class DateTimeService : IDateTimeService
    {
        public DateTime NowUtc => DateTime.UtcNow;
    }
}