namespace Application.Interfaces.OneTimePin
{
    using Microsoft.AspNetCore.Identity;

    using Shared;

    public interface IOneTimePinService
    {
        Result<string> GenerateOtp(string username, int expirationMinutes, PasswordOptions opts = null);
        Result<bool> ValidateOtp(string otpId, string username, string otp);
    }
}