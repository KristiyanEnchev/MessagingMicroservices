namespace Application.Handlers.Identity.Commands.Password
{
    using System.Threading;
    using System.Threading.Tasks;
    using System.ComponentModel.DataAnnotations;

    using MediatR;

    using Application.Interfaces;
    using Application.Interfaces.Identity;

    using Shared;

    public class ChangePasswordCommand : IRequest<Result<string>>
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; }

        [Required]
        [Compare("NewPassword", ErrorMessage = "Passwords don't match.")]
        public string ConfirmPassword { get; set; }

        public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand, Result<string>>
        {
            private readonly IPasswordService _passwordService;
            private readonly IUser _currentUser;

            public ChangePasswordCommandHandler(
                IPasswordService passwordService,
                IUser currentUser)
            {
                _passwordService = passwordService;
                _currentUser = currentUser;
            }

            public async Task<Result<string>> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
            {
                if (_currentUser.Email != null && _currentUser.Email != request.Email && !_currentUser.IsAdmin)
                {
                    return Result<string>.Failure("You are not authorized to change this password.");
                }

                return await _passwordService.ChangePassword(_currentUser.Id!, request.CurrentPassword, request.NewPassword);
            }
        }
    }
}