using backend.Models;
using backend.src.Models;
using backend.src.Models.backend.src.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public required DbSet<User> Users { get; set; }
        public required DbSet<Board> Boards { get; set; }

        public required DbSet<src.Models.Task> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User -> Boards
            modelBuilder.Entity<Board>()
                .HasOne(b => b.CreatedByUser) 
                .WithMany(u => u.Boards) 
                .HasForeignKey(b => b.CreatedByUserId) 
                .OnDelete(DeleteBehavior.Restrict);

            
            modelBuilder.Entity<Board>()
                .HasOne(b => b.AssignedUser) 
                .WithMany() 
                .HasForeignKey(b => b.AssignedUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }






}
