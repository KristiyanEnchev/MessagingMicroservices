namespace Application.Handlers.Identity.Commands.Role
{
    using FluentValidation;
    public class DeleteRoleCommandValidator : AbstractValidator<DeleteRoleCommand>
    {
        public DeleteRoleCommandValidator()
        {
            RuleFor(x => x.RoleName)
                .NotEmpty().WithMessage("Role name is required");
        }
    }
}