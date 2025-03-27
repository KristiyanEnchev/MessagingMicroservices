namespace Models.Identity
{
    public abstract class UserRequestModel
    {
        protected internal UserRequestModel(string email, string password, bool rememberMe)
        {
            Email = email;
            Password = password;
            RememberMe = rememberMe;
        }

        public string Email { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; }
    }
}