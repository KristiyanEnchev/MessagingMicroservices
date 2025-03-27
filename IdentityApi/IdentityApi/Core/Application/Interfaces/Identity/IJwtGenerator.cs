namespace Application.Interfaces.Identity
{
    using System.Threading.Tasks;
    
    using Models.Identity;
    
    using Domain.Entities.Identity;

    public interface IJwtGenerator
    {
        Task<UserResponseModel> GenerateToken(User user);
        Task<User> ValidateRefreshToken(string refreshToken);
        Task RemoveAuthenticationToken(User user);
    }
}