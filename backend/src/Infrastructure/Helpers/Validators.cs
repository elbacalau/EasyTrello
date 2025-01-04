using System.Net.Mail;

namespace backend.src.Infrastructure.Helpers
{
    public class Validators
    {
        public static bool IsEmail(string email)
        {
            bool valid = true;

            try
            {
                var MailAddress = new MailAddress(email);
            }
            catch
            {
                valid = false;
            }

            return valid;
        }
    }
}