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

            // 1 -> n
            modelBuilder.Entity<Board>()
                .HasOne(b => b.CreatedByUser)
                .WithMany(u => u.Boards)
                .HasForeignKey(b => b.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // n -> n  
            modelBuilder.Entity<Board>()
                .HasMany(b => b.AssignedUsers)
                .WithMany(u => u.AssignedBoards)
                .UsingEntity(j => j.ToTable("BoardUsers"));
        }

    }






}
