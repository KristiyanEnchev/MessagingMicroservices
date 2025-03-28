namespace Application.Interfaces 
{
    public interface IUser
    {
        string? Id { get; }
        string? Email { get; }
        bool IsInRole(string role);
        bool IsAdmin { get; }
    }
}