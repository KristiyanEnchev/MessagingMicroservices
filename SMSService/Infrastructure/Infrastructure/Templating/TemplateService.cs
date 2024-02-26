namespace Infrastructure.Templating
{
    using System.Text;
    using System.Reflection;

    using Models.SMS;

    using Application.Interfaces.SMS;

    public class TemplateService : ITemplateService
    {
        public async Task<string> GenerateSMSTemplate(string templateName, IEnumerable<TemplateData> placeholders)
        {
            string template = await GetLocalSMSTemplateAsync(templateName);

            template = await ProcessSMSTemplate(template, placeholders);

            return template;
        }

        public async Task<string> ProcessSMSTemplate(string template, IEnumerable<TemplateData> placeholders)
        {
            if (placeholders == null)
            {
                placeholders = new List<TemplateData>();
            }

            foreach (var placeholder in placeholders)
            {
                template = template.Replace("{{" + placeholder.Field!.ToLower() + "}}", placeholder.Value);
            }

            return template;
        }

        public async Task<string> GetLocalSMSTemplateAsync(string templateName)
        {
            var assembly = typeof(TemplateData).GetTypeInfo().Assembly;
            string baseDirectory = Path.GetDirectoryName(assembly!.Location)!;
            string tmplFolder = Path.Combine(baseDirectory, "SMSTemplates");
            string filePath = Path.Combine(tmplFolder, $"{templateName}.txt");

            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"Template file {filePath} not found.");
            }

            using var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            using var sr = new StreamReader(fs, Encoding.Default);
            string smsText = await sr.ReadToEndAsync();
            sr.Close();

            return smsText;
        }
    }
}