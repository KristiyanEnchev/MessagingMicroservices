namespace Application.Handlers.Identity.Commands.Role
{
    using FluentValidation;

    public class RemoveUserFromRoleCommandValidator : AbstractValidator<RemoveUserFromRoleCommand>
    {
        public RemoveUserFromRoleCommandValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("User ID is required");

            RuleFor(x => x.RoleName)
                .NotEmpty().WithMessage("Role name is required");
        }
    }
}