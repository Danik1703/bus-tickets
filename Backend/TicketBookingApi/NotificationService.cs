using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;

public class NotificationService
{
    private readonly SendGridClient _sendGridClient;

    public NotificationService(SendGridClient sendGridClient)
    {
        _sendGridClient = sendGridClient;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        var from = new EmailAddress("your-email@example.com", "Your Name");
        var to = new EmailAddress(toEmail);
        var plainTextContent = message;
        var htmlContent = $"<strong>{message}</strong>";
        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);

        var response = await _sendGridClient.SendEmailAsync(msg);
    }
}
