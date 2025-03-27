namespace Models.Account
{
    using AutoMapper;

    using Domain.Entities.Identity;

    using Shared.Mappings;

    public class UserResponseGetModel : IMapFrom<User>
    {
        public string? Id { get; set; }
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public string? Name { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; }
        public string? Role { get; set; }

        public string? CreatedBy { get; set; }
        public DateTimeOffset? CreatedDate { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTimeOffset? UpdatedDate { get; set; }

        public virtual void Mapping(Profile mapper)
        {
            mapper.CreateMap<User, UserResponseGetModel>()
                    .ForMember(dest => dest.Name, opt => opt.MapFrom(src =>
                        string.IsNullOrWhiteSpace(src.FirstName) ? null : src.FirstName + " " + src.LastName));
        }
    }
}
