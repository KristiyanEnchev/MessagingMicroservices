namespace Infrastructure.Utility
{
    using System.Net;
    using System.Net.Mail;
    using System.Text.RegularExpressions;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    using Shared.Exceptions;

    using Models;
    using Models.Attachments;

    public class UtilityService
    {
        public static string CreateWorkingDir(string rootDir)
        {
            string workDir = Path.Combine(rootDir, Guid.NewGuid().ToString());

            if (Directory.Exists(workDir))
                return CreateWorkingDir(rootDir);
            else
            {
                Directory.CreateDirectory(workDir);
                return workDir;
            }
        }

        public static Task<IDictionary<string, string>> GetAttachmentsAsync(string workingDir, IEnumerable<AttachmentBaseModel> attachments)
        {
            IDictionary<string, string> files = new Dictionary<string, string>();

            if (attachments != null && attachments.Count() > 0)
            {
                Parallel.ForEach(attachments, item =>
                {
                    string filepath = Path.Combine(workingDir, Regex.Replace(item.Name, @"[\\/:*?""<>|]", " "));

                    if (item is UrlAttachment)
                    {
                        using (var client = new WebClient())
                        {
                            try
                            {
                                client.DownloadFile(((UrlAttachment)item).Uri, filepath);
                                files.Add(item.Name, filepath);
                            }
                            catch (Exception ex)
                            {
                                throw ex;
                            }
                        }
                    }
                    else if (item is FileAttachmentModel)
                    {
                        try
                        {
                            File.WriteAllBytes(filepath, ((FileAttachmentModel)item).ContentBytes);
                            files.Add(item.Name, filepath);
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                    }
                });
            }

            return Task.FromResult(files);
        }

        public static void AddRecipients(IEnumerable<string> addresses, MailAddressCollection collection)
        {
            if (addresses != null)
            {
                foreach (string? address in addresses.Where(ccValue => !string.IsNullOrWhiteSpace(ccValue)))
                {
                    collection.Add(new MailAddress(address.Trim()));
                }
            }
        }

        public async Task<EmailTemplateModel> ParseEmailDefinition(HttpResponseMessage message)
        {
            if (message.Content != null)
            {
                try
                {
                    string content = await message.Content.ReadAsStringAsync();

                    if (JsonConvert.DeserializeObject(content) is JArray array)
                    {
                        var smsList = array.ToObject<List<EmailTemplateModel>>();
                        return smsList?.FirstOrDefault();
                    }
                    else if (JsonConvert.DeserializeObject(content) is JObject obj)
                    {
                        return obj.ToObject<EmailTemplateModel>();
                    }
                }
                catch (JsonException ex)
                {
                    throw new CustomException(ex.Message);
                }
            }

            return null;
        }
    }
}
