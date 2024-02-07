namespace Models.Attachments
{
    using System.ComponentModel.DataAnnotations;

    public class AttachmentBaseModel
    {
        [Required]
        [RegularExpression(@"\A(?!(?:COM[0-9]|CON|LPT[0-9]|NUL|PRN|AUX|com[0-9]|con|lpt[0-9]|nul|prn|aux)|[\s\.])[^\\\/:*" + "\"" + "?<>|]{1,254}\\z",
         ErrorMessage = "Name of the file does not follow Microsoft file naming convention.")]
        public string? Name { get; set; }
    }
}