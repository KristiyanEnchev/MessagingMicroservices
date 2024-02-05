namespace Infrastructure.Templating
{
    using System.Web;

    using Models;

    public class TemplateService
    {
        public async Task<string> ReplaceDataOnTemplate(string templateContent, IEnumerable<TemplateData> placeholders)
        {
            templateContent = HttpUtility.HtmlDecode(templateContent);

            if (placeholders != null)
                foreach (var placeholder in placeholders)
                {
                    templateContent = templateContent.Replace("{{" + placeholder.Field + "}}", placeholder.Value);
                }

            return templateContent;
        }

    }
}