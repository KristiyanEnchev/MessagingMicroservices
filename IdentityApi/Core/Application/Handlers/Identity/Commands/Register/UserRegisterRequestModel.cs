namespace Application.Handlers.Identity.Commands.Register
{
    using Models.Identity;

    public class UserRegisterRequestModel : UserRequestModel
    {
        internal UserRegisterRequestModel(string firstName, string lastName, string email, string password, bool rememberMe)
            : base(email, password, rememberMe)
        {
            FirstName = firstName;
            LastName = lastName;
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}