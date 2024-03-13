namespace Application.Interfaces.OneTimePin
{
    using Microsoft.AspNetCore.Identity;

    using Models.OneTimePin;

    using Shared;

    public interface IOneTimePinService
    {
        Result<OneTimePinGenerateResponse> GenerateOtp(string username, int expirationMinutes, PasswordOptions opts = null);
        Result<OneTimePinValidateResponse> ValidateOtp(string otpId, string username, string otp);
    }
}