namespace Application.Interfaces.Post
{
    public interface INotificationService
    {
        Task<bool> SendNotificationAsync(string userId, string title, string message, string type);
    }
}
