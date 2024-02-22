namespace Models.SMS
{
    using System.ComponentModel.DataAnnotations;

    public class TwilioSettings
    {
        [Required]
        public string? AccountSid { get; set; }
        [Required]
        public string? AuthToken { get; set; }
    }
}