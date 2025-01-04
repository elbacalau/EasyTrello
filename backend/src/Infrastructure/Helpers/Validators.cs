using System.Net.Mail;
using System.Text.RegularExpressions;

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

        public static bool IsPasswordValid(string password)
        {
            // the password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one digit
            return password.Length >= 6 &&
                   password.Any(char.IsUpper) &&
                   password.Any(char.IsLower) &&
                   password.Any(char.IsDigit);
        }

        public static bool IsPhoneNumberValid(string? phoneNumber)
        {
            // simple phone validation
            if (string.IsNullOrEmpty(phoneNumber)) return true;  // allow null number
            var phoneRegex = @"^\+?[1-9]\d{1,14}$";
            return Regex.IsMatch(phoneNumber, phoneRegex);
        }
    }
}