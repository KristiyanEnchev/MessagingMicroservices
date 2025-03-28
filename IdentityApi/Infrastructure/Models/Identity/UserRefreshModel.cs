namespace Models.Identity
{
    public abstract class UserRefreshModel
    {
        protected internal UserRefreshModel(string refreshToken)
        {
            RefreshToken = refreshToken;
        }

        public string RefreshToken { get; set; }
    }
}