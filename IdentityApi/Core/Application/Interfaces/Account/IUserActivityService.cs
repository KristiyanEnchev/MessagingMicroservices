namespace Application.Interfaces.Account
{
    using Domain.Entities.Identity;

    public interface IUserActivityService
    {
        Task LogActivityAsync(string userId, string activityType, bool isSuccessful, string additionalInfo = null);
        Task<List<UserActivity>> GetUserActivitiesAsync(string userId, int take = 20);
    }
}