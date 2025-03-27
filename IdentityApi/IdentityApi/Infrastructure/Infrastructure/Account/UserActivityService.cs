namespace Infrastructure.Account
{
    using Microsoft.AspNetCore.Http;
    using Microsoft.EntityFrameworkCore;

    using Domain.Entities.Identity;

    using Persistence.Contexts;

    using Application.Interfaces.Account;

    public class UserActivityService : IUserActivityService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserActivityService(ApplicationDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task LogActivityAsync(string userId, string activityType, bool isSuccessful, string additionalInfo = null)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var ipAddress = httpContext?.Connection?.RemoteIpAddress?.ToString() ?? "Unknown";
            var userAgent = httpContext?.Request?.Headers["User-Agent"].ToString() ?? "Unknown";

            var activity = new UserActivity
            {
                UserId = userId,
                ActivityType = activityType,
                IpAddress = ipAddress,
                UserAgent = userAgent,
                Timestamp = DateTime.UtcNow,
                IsSuccessful = isSuccessful,
                AdditionalInfo = additionalInfo
            };

            _dbContext.UserActivities.Add(activity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<List<UserActivity>> GetUserActivitiesAsync(string userId, int take = 20)
        {
            return await _dbContext.UserActivities
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.Timestamp)
                .Take(take)
                .ToListAsync();
        }
    }
}
