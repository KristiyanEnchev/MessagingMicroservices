namespace Application.Handlers.Identity.Commands.Password
{
    using System.Threading;
    using System.Threading.Tasks;
    using System.ComponentModel.DataAnnotations;

    using MediatR;

    using Application.Interfaces.Identity;

    using Shared;

    public class ForgotPasswordCommand : IRequest<Result<string>>
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string ResetPasswordUrl { get; set; }

        public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, Result<string>>
        {
            private readonly IPasswordService _passwordService;

            public ForgotPasswordCommandHandler(IPasswordService passwordService)
            {
                _passwordService = passwordService;
            }

            public async Task<Result<string>> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
            {
                return await _passwordService.ForgotPassword(request, cancellationToken);
            }
        }
    }
}