namespace Infrastructure.Templating
{
    using System.Text;
    using System.Dynamic;
    using System.Reflection;

    using RazorEngineCore;

    using Application.Interfaces.Services;

    using Models.Mailing;

    public class TemplateService : ITemplateService
    {
        public async Task<string> GenerateEmailTemplate(string templateName, IEnumerable<TemplateData> placeholders)
        {
            string template = await GetLocalEmailTemplateAsync(templateName);

            foreach (var placeholder in placeholders)
            {
                template = template.Replace("{{" + placeholder.Field!.ToLower() + "}}", placeholder.Value);
            }

            return template;
        }

        public async Task<string> GetLocalEmailTemplateAsync(string templateName)
        {
            var assemply = typeof(TemplateData).GetTypeInfo().Assembly;
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