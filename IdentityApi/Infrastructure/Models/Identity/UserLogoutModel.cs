namespace Models.Identity
{
    public abstract class UserLogoutModel
    {
        protected internal UserLogoutModel(string email)
        {
            Email = email;
        }

        public string Email { get; set; }
    }
}