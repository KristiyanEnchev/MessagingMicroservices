namespace Infrastructure.Templating
{
    using System.Web;
    using System.Text;
    using System.Reflection;

    using Newtonsoft.Json;

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

        public async Task<string> ApplyPartialTemplate(string templateName)
        {
            string shell = await GetLocalEmailTemplate("DefaultTemplate");

            var partialTemplate = LoadTemplateFromFile(templateName);

            shell = shell.Replace("|Title|", partialTemplate.Title);
            shell = shell.Replace("|BodyContent|", partialTemplate.Body);
            shell = shell.Replace("|FooterContent|", partialTemplate.Footer);

            return shell;
        }

        public EmailTemplateModel LoadTemplateFromFile(string templateName)
        {
            var assemply = typeof(Models.TemplateData).GetTypeInfo().Assembly;
            string baseDirectory = Path.GetDirectoryName(assemply!.Location)!;
            string tmplFolder = Path.Combine(baseDirectory, "EmailTemplates");
            string filePath = Path.Combine(tmplFolder, $"{templateName}.json");

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"Template file {filePath} not found.");
            }

            string jsonContent = File.ReadAllText(filePath);
            EmailTemplateModel template = JsonConvert.DeserializeObject<EmailTemplateModel>(jsonContent);
            return template ?? throw new InvalidOperationException("Failed to deserialize template.");
        }

        public async Task<string> GetLocalEmailTemplate(string templateName)
        {
            var assemply = typeof(Models.TemplateData).GetTypeInfo().Assembly;
            string baseDirectory = Path.GetDirectoryName(assemply!.Location)!;
            string tmplFolder = Path.Combine(baseDirectory, "EmailTemplates");
            string filePath = Path.Combine(tmplFolder, $"{templateName}.html");

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"Template file {filePath} not found.");
            }

            using var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            using var sr = new StreamReader(fs, Encoding.Default);
            string mailText = await sr.ReadToEndAsync();
            sr.Close();

            return mailText;
        }
    }
}