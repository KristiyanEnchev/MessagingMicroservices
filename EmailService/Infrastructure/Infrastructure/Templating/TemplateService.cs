namespace Infrastructure.Templating
{
    using System.Reflection;
    using System.Text;
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

        public async Task<string> ApplyPartialTemplate(string title, string body, string footer)
        {
            string shell = await GetLocalEmailTemplate("DefaultTemplate");

            shell = shell.Replace("|Title|", title);
            shell = shell.Replace("|BodyContent|", body);
            shell = shell.Replace("|FooterContent|", footer);

            return shell;
        }

        public async Task<string> GetLocalEmailTemplate(string templateName)
        {
            var assemply = typeof(Models.TemplateData).GetTypeInfo().Assembly;
            string baseDirectory = Path.GetDirectoryName(assemply!.Location)!;
            string tmplFolder = Path.Combine(baseDirectory, "EmailTemplates");
            string filePath = Path.Combine(tmplFolder, $"{templateName}.html");

            using var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            using var sr = new StreamReader(fs, Encoding.Default);
            string mailText = sr.ReadToEnd();
            sr.Close();

            return mailText;
        }
    }
}