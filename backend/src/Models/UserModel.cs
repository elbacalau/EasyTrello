using System.Security.Cryptography.X509Certificates;
using System.Text.Json.Serialization;
using backend.src.Models.backend.src.Models;

namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }               
        public required string FirstName { get; set; }      
        public required string LastName { get; set; }       
        public required string Email { get; set; }          
        public required string Password { get; set; }       
        public string? PhoneNumber { get; set; }  
        public string? ProfilePictureUrl { get; set; }  
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; } 
        public bool IsActive { get; set; }       

        // relationships
        [JsonIgnore]
        public ICollection<Board> Boards { get; set; } = [];
        
        [JsonIgnore]
        public ICollection<Board> AssignedBoards {get; set; } = [];

    }
}
