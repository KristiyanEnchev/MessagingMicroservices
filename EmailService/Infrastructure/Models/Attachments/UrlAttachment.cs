namespace Models.Attachments
{
    using System.ComponentModel.DataAnnotations;

    public class UrlAttachment : AttachmentBaseModel
    {
        [Required]
        public string? Uri { get; set; }

        public bool Cache { get; set; }
    }
}