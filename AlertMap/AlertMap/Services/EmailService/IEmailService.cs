namespace AlertMap.Emails
{
    public interface IEmailService
    {
        void Send(EmailMessage emailMessage);
        void ReceiveEmail(int maxCount = 10);
    }
}
