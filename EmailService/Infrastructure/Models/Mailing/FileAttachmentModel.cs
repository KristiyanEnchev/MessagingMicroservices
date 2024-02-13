namespace Models.Mailing
{
    using System.ComponentModel.DataAnnotations;

    public class FileAttachmentModel
    {
        [Required]
        public string? Name { get; set; }

        [Required]
        public byte[]? ContentBytes { get; set; }
    }
}
