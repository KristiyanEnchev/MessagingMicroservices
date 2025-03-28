namespace Application.Interfaces.Identity
{
    using System.Threading;
    using System.Threading.Tasks;

    using Shared;

    using Application.Handlers.Identity.Commands.Password;

    public interface IPasswordService
    {
        Task<Result<string>> ForgotPassword(ForgotPasswordCommand request, CancellationToken cancellationToken);
        Task<Result<string>> ResetPassword(ResetPasswordCommand request, CancellationToken cancellationToken);
        Task<Result<string>> ChangePassword(string userId, string currentPassword, string newPassword);
    }
}