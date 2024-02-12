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
        public async Task<string> GenerateEmailTemplateAsync(string templateName, IEnumerable<TemplateData> mailTemplateModel)
        {
            var mailTemplateData = GetDynamicData(mailTemplateModel);
            string template = await GetLocalEmailTemplateAsync(templateName);

            IRazorEngine razorEngine = new RazorEngine();
            IRazorEngineCompiledTemplate modifiedTemplate = razorEngine.Compile(template);

            return modifiedTemplate.Run(mailTemplateModel);
        }

        private static dynamic GetDynamicData(IEnumerable<TemplateData> TemplateDataList)
        {
            dynamic dynamicData = new ExpandoObject();
            foreach (var templateData in TemplateDataList!)
            {
                ((IDictionary<string, object>)dynamicData)[templateData.Field!] = templateData.Value!;
            }

            return dynamicData;
        }

        public async Task<string> GetLocalEmailTemplateAsync(string templateName)
        {
            var assemply = typeof(TemplateData).GetTypeInfo().Assembly;
            string baseDirectory = Path.GetDirectoryName(assemply!.Location)!;
            string tmplFolder = Path.Combine(baseDirectory, "EmailTemplates");
            string filePath = Path.Combine(tmplFolder, $"{templateName}.cshtml");

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