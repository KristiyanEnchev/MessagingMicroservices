namespace Application.Interfaces.OneTimePin
{
    using Microsoft.AspNetCore.Identity;

    public interface IOneTimePinService
    {
        string GenerateOtp(string username, int expirationMinutes, PasswordOptions opts = null);
    }
}
