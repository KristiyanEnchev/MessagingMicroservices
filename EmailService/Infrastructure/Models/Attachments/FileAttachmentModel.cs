namespace Models.Attachments
{
    using System.ComponentModel.DataAnnotations;

    public class FileAttachmentModel : AttachmentBaseModel
    {
        [Required]
        public byte[]? ContentBytes { get; set; }
    }
}