namespace Application.Handlers.Identity.Commands.Password
{
    using System.Threading;
    using System.Threading.Tasks;
    using System.ComponentModel.DataAnnotations;

    using MediatR;

    using Application.Interfaces.Identity;

    using Shared;

    public class ResetPasswordCommand : IRequest<Result<string>>
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; }

        [Required]
        [Compare("NewPassword", ErrorMessage = "Passwords don't match.")]
        public string ConfirmPassword { get; set; }

        public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand, Result<string>>
        {
            private readonly IPasswordService _passwordService;

            public ResetPasswordCommandHandler(IPasswordService passwordService)
            {
                _passwordService = passwordService;
            }

            public async Task<Result<string>> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
            {
                return await _passwordService.ResetPassword(request, cancellationToken);
            }
        }
    }
}