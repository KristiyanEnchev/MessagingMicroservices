namespace Application.Handlers.Identity.Commands.Role
{
    using FluentValidation;

    public class AddUserToRoleCommandValidator : AbstractValidator<AddUserToRoleCommand>
    {
        public AddUserToRoleCommandValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("User ID is required");

            RuleFor(x => x.RoleName)
                .NotEmpty().WithMessage("Role name is required");
        }
    }
}