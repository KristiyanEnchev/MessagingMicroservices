namespace Models.Account
{
    using AutoMapper;

    using Domain.Entities.Identity;

    using Shared.Mappings;

    public class UserActivityModel : IMapFrom<UserActivity>
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string ActivityType { get; set; }
        public DateTime Timestamp { get; set; }
        public string IpAddress { get; set; }
        public string UserAgent { get; set; }
        public bool IsSuccessful { get; set; }
        public string AdditionalInfo { get; set; }
        public void Mapping(Profile profile)
        {
            profile.CreateMap<UserActivity, UserActivityModel>();
            profile.CreateMap<UserActivityModel, UserActivity>();
        }
    }
}