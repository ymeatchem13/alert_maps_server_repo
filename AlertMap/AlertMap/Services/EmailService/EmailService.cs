using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

namespace AlertMap.Emails
{
    public class EmailService: IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config) 
        {
            _config = config;
        }

        public async void ReceiveEmail(int maxCount = 10)
        {
            String apiKey = _config.GetConnectionString("SendGridAPIKey");
            SendGridClient client = new SendGridClient(apiKey);

            var data = @"{
                ""url"": ""http://ucalertmaps@outlook.com"",
                ""hostname"": ""outlook.com"",
                ""spam_check"": false,
                ""send_raw"": true
            }";

            var response = await client.RequestAsync(
                method: SendGridClient.Method.POST,
                urlPath: "user/webhooks/parse/settings",
                requestBody: data
                );

            Console.WriteLine(response);
            Console.WriteLine(response.Body.ReadAsStringAsync().Result);
            Console.WriteLine(response.Headers.ToString());
        }

        public async void Send(EmailMessage emailMessage)
        {
            String apiKey = _config.GetConnectionString("SendGridAPIKey");
            SendGridClient client = new SendGridClient(apiKey);

            EmailAddress from = new EmailAddress(emailMessage.From, "Alert Maps Report");
            String subject = emailMessage.Subject;

            EmailAddress to = new EmailAddress(emailMessage.To, "UC Alert Maps");

            String plainTextContent = emailMessage.Content;
            String htmlContent = "<strong>" + emailMessage.Content + "</strong";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }   
    }
}
