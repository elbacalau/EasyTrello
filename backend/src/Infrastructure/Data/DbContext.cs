using backend.Models;
using backend.src.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public required DbSet<User> Users { get; set; }
        public required DbSet<Board> Boards { get; set; }
        public required DbSet<TaskModel> Tasks { get; set; }
        public required DbSet<BoardUser> BoardUsers { get; set; }
        public required DbSet<TaskComment> TaskComments { get; set; }
        public required DbSet<BoardColumn> BoardColumns { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ---- Clave primaria compuesta de BoardUser ----
            modelBuilder.Entity<BoardUser>()
                .HasKey(bu => new { bu.BoardId, bu.UserId });

            modelBuilder.Entity<BoardUser>()
                .HasOne(bu => bu.Board)
                .WithMany(b => b.BoardUsers)
                .HasForeignKey(bu => bu.BoardId);

            modelBuilder.Entity<BoardUser>()
                .HasOne(bu => bu.User)
                .WithMany(u => u.BoardUsers)
                .HasForeignKey(bu => bu.UserId);

            // Hasheamos la contraseña "Password1" con BCrypt
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword("Password1");

            // ==== Seed de Usuarios ====
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FirstName = "Juan",
                    LastName = "Pérez",
                    Email = "juan.perez@example.com",
                    Password = hashedPassword,
                    DateCreated = DateTime.UtcNow,
                    IsActive = true
                },
                new User
                {
                    Id = 2,
                    FirstName = "María",
                    LastName = "López",
                    Email = "maria.lopez@example.com",
                    Password = hashedPassword,
                    DateCreated = DateTime.UtcNow,
                    IsActive = true
                },
                new User
                {
                    Id = 3,
                    FirstName = "Carlos",
                    LastName = "Sánchez",
                    Email = "carlos.sanchez@example.com",
                    Password = hashedPassword,
                    DateCreated = DateTime.UtcNow,
                    IsActive = true
                },
                new User
                {
                    Id = 4,
                    FirstName = "Ana",
                    LastName = "Rodríguez",
                    Email = "ana.rodriguez@example.com",
                    Password = hashedPassword,
                    DateCreated = DateTime.UtcNow,
                    IsActive = true
                },
                new User
                {
                    Id = 5,
                    FirstName = "Lucía",
                    LastName = "García",
                    Email = "lucia.garcia@example.com",
                    Password = hashedPassword,
                    DateCreated = DateTime.UtcNow,
                    IsActive = true
                }
            );

            // ==== Seed de Tableros ====
            modelBuilder.Entity<Board>().HasData(
                new Board
                {
                    Id = 1,
                    Name = "Proyecto Backend",
                    Description = "Tareas para el proyecto de backend",
                    CreatedAt = DateTime.UtcNow,
                    Status = "Activo",
                    Visibility = "Privado",
                    CreatedByUserId = 1,
                    AssignedUserId = 2,
                    BackgroundColor = "#FFB6C1"
                },
                new Board
                {
                    Id = 2,
                    Name = "Proyecto Frontend",
                    Description = "Tareas para el proyecto de frontend",
                    CreatedAt = DateTime.UtcNow,
                    Status = "Activo",
                    Visibility = "Privado",
                    CreatedByUserId = 1,
                    AssignedUserId = 3,
                    BackgroundColor = "#87CEEB"
                },
                // Nuevo Board 3
                new Board
                {
                    Id = 3,
                    Name = "Proyecto Mobile",
                    Description = "Tareas para la aplicación móvil",
                    CreatedAt = DateTime.UtcNow,
                    Status = "Activo",
                    Visibility = "Privado",
                    CreatedByUserId = 2, // Por ejemplo, creado por María
                    AssignedUserId = 4, // Asignado a Ana
                    BackgroundColor = "#D3FFA3" // un color distinto
                }
            );

            // ==== Seed de Columnas de Tablero ====
            modelBuilder.Entity<BoardColumn>().HasData(
                // Columnas para el Board 1
                new BoardColumn
                {
                    Id = 1,
                    ColumnName = "To Do",
                    BoardId = 1
                },
                new BoardColumn
                {
                    Id = 2,
                    ColumnName = "In Progress",
                    BoardId = 1
                },
                new BoardColumn
                {
                    Id = 3,
                    ColumnName = "Done",
                    BoardId = 1
                },
                // Columnas para el Board 2
                new BoardColumn
                {
                    Id = 4,
                    ColumnName = "To Do",
                    BoardId = 2
                },
                new BoardColumn
                {
                    Id = 5,
                    ColumnName = "In Progress",
                    BoardId = 2
                },
                new BoardColumn
                {
                    Id = 6,
                    ColumnName = "Done",
                    BoardId = 2
                },
                // Columnas para el Board 3
                new BoardColumn
                {
                    Id = 7,
                    ColumnName = "Backlog",
                    BoardId = 3
                },
                new BoardColumn
                {
                    Id = 8,
                    ColumnName = "In Progress",
                    BoardId = 3
                },
                new BoardColumn
                {
                    Id = 9,
                    ColumnName = "Ready for QA",
                    BoardId = 3
                }
            );

            // ==== Seed de Tareas (TaskModel) ====
            modelBuilder.Entity<TaskModel>().HasData(
                // Tareas para el Board 1
                new TaskModel
                {
                    Id = 1,
                    Name = "Configurar proyecto",
                    Description = "Configurar la base de datos y la estructura inicial",
                    CreatedAt = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(7),
                    Status = src.Models.TaskStatus.ToDo,
                    Priority = TaskPriority.High,
                    Completed = false,
                    BoardColumnId = 1,  // To Do en Board 1
                    BoardId = 1,
                    AssignedUserId = 2 // Asignada a María
                },
                new TaskModel
                {
                    Id = 2,
                    Name = "Implementar modelos",
                    Description = "Crear los modelos de EF Core",
                    CreatedAt = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(10),
                    Status = src.Models.TaskStatus.InProgress,
                    Priority = TaskPriority.Medium,
                    Completed = false,
                    BoardColumnId = 2,  // In Progress en Board 1
                    BoardId = 1,
                    AssignedUserId = 3
                },
                new TaskModel
                {
                    Id = 3,
                    Name = "Crear endpoints API",
                    Description = "Crear los controladores y endpoints necesarios",
                    CreatedAt = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(14),
                    Status = src.Models.TaskStatus.ToDo,
                    Priority = TaskPriority.Critical,
                    Completed = false,
                    BoardColumnId = 1,
                    BoardId = 1,
                    AssignedUserId = 4
                },
                // Tareas para el Board 2
                new TaskModel
                {
                    Id = 4,
                    Name = "Diseñar UI principal",
                    Description = "Crear los mockups para la página principal",
                    CreatedAt = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(5),
                    Status = src.Models.TaskStatus.ToDo,
                    Priority = TaskPriority.Medium,
                    Completed = false,
                    BoardColumnId = 4,  // To Do en Board 2
                    BoardId = 2,
                    AssignedUserId = 3
                },
                new TaskModel
                {
                    Id = 5,
                    Name = "Maquetar pantalla de login",
                    Description = "HTML/CSS para la pantalla de login",
                    CreatedAt = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(8),
                    Status = src.Models.TaskStatus.InProgress,
                    Priority = TaskPriority.High,
                    Completed = false,
                    BoardColumnId = 5,
                    BoardId = 2,
                    AssignedUserId = 5
                },

                // Tareas nuevas para Board 1 (una completada)
                new TaskModel
                {
                    Id = 6,
                    Name = "Documentar modelos",
                    Description = "Agregar documentación XML y comentarios en el código",
                    CreatedAt = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(3),
                    Status = src.Models.TaskStatus.Completed,
                    Priority = TaskPriority.Low,
                    Completed = true,
                    BoardColumnId = 3, // "Done" en Board 1
                    BoardId = 1,
                    AssignedUserId = 3
                },

                // Tareas nuevas para Board 2 (una completada)
                new TaskModel
                {
                    Id = 7,
                    Name = "Ajustar estilos responsive",
                    Description = "Optimizar vistas para dispositivos móviles",
                    CreatedAt = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(4),
                    Status = src.Models.TaskStatus.Completed,
                    Priority = TaskPriority.Critical,
                    Completed = true,
                    BoardColumnId = 6, // "Done" en Board 2
                    BoardId = 2,
                    AssignedUserId = 5
                },

                // Tareas para el Board 3
                new TaskModel
                {
                    Id = 8,
                    Name = "Definir arquitectura inicial",
                    Description = "Elegir patrones para la app mobile y preparar base del proyecto",
                    CreatedAt = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(15),
                    Status = src.Models.TaskStatus.ToDo,
                    Priority = TaskPriority.High,
                    Completed = false,
                    BoardColumnId = 7,  // "Backlog" en Board 3
                    BoardId = 3,
                    AssignedUserId = 4
                },
                new TaskModel
                {
                    Id = 9,
                    Name = "Autenticación y registro",
                    Description = "Configurar el flujo de registro e inicio de sesión en la app móvil",
                    CreatedAt = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(20),
                    Status = src.Models.TaskStatus.InProgress,
                    Priority = TaskPriority.Medium,
                    Completed = false,
                    BoardColumnId = 8,
                    BoardId = 3,
                    AssignedUserId = 2
                },
                new TaskModel
                {
                    Id = 10,
                    Name = "Pruebas QA iniciales",
                    Description = "Realizar testeo básico de la aplicación",
                    CreatedAt = DateTime.UtcNow,
                    DueDate = DateTime.UtcNow.AddDays(25),
                    Status = src.Models.TaskStatus.ToDo,
                    Priority = TaskPriority.Low,
                    Completed = false,
                    BoardColumnId = 7, 
                    BoardId = 3,
                    AssignedUserId = 3
                }
            );

            // ==== Seed de relación BoardUser ====
            // Indica qué usuarios están en qué tableros y con qué rol
            modelBuilder.Entity<BoardUser>().HasData(
                // Board 1
                new BoardUser
                {
                    BoardId = 1,
                    UserId = 1,
                    Role = BoardRole.Owner
                },
                new BoardUser
                {
                    BoardId = 1,
                    UserId = 2,
                    Role = BoardRole.Admin
                },
                new BoardUser
                {
                    BoardId = 1,
                    UserId = 3,
                    Role = BoardRole.User
                },
                // Board 2
                new BoardUser
                {
                    BoardId = 2,
                    UserId = 1,
                    Role = BoardRole.Owner
                },
                new BoardUser
                {
                    BoardId = 2,
                    UserId = 3,
                    Role = BoardRole.Admin
                },
                new BoardUser
                {
                    BoardId = 2,
                    UserId = 5,
                    Role = BoardRole.User
                },
                // Board 3
                new BoardUser
                {
                    BoardId = 3,
                    UserId = 2,
                    Role = BoardRole.Owner
                },
                new BoardUser
                {
                    BoardId = 3,
                    UserId = 4,
                    Role = BoardRole.Admin
                },
                new BoardUser
                {
                    BoardId = 3,
                    UserId = 3,
                    Role = BoardRole.User
                }
            );

            // ==== Seed de Comentarios (TaskComment) ====
            modelBuilder.Entity<TaskComment>().HasData(
                // Comentarios de las tareas originales
                new TaskComment
                {
                    Id = 1,
                    Comment = "Revísese la configuración de migraciones",
                    CreatedAt = DateTime.UtcNow,
                    TaskId = 1,
                    UserId = 1
                },
                new TaskComment
                {
                    Id = 2,
                    Comment = "El modelo está casi listo, falta solo la parte de relaciones",
                    CreatedAt = DateTime.UtcNow,
                    TaskId = 2,
                    UserId = 3
                },
                new TaskComment
                {
                    Id = 3,
                    Comment = "Asegurarse de que la autenticación funcione correctamente",
                    CreatedAt = DateTime.UtcNow,
                    TaskId = 3,
                    UserId = 4
                },
                new TaskComment
                {
                    Id = 4,
                    Comment = "Diseño aprobado por el cliente",
                    CreatedAt = DateTime.UtcNow,
                    TaskId = 4,
                    UserId = 3
                },
                new TaskComment
                {
                    Id = 5,
                    Comment = "Pendiente refinar estilos para móviles",
                    CreatedAt = DateTime.UtcNow,
                    TaskId = 5,
                    UserId = 5
                },

                // Comentarios adicionales
                new TaskComment
                {
                    Id = 6,
                    Comment = "Documentación finalizada y revisada por el equipo",
                    CreatedAt = DateTime.UtcNow,
                    TaskId = 6,
                    UserId = 3
                },
                new TaskComment
                {
                    Id = 7,
                    Comment = "Se ha completado el soporte responsive para la pantalla principal",
                    CreatedAt = DateTime.UtcNow,
                    TaskId = 7,
                    UserId = 5
                },
                new TaskComment
                {
                    Id = 8,
                    Comment = "Decidida la arquitectura MVP para el proyecto mobile",
                    CreatedAt = DateTime.UtcNow,
                    TaskId = 8,
                    UserId = 4
                },
                new TaskComment
                {
                    Id = 9,
                    Comment = "Falta probar el flujo de recuperación de contraseña",
                    CreatedAt = DateTime.UtcNow,
                    TaskId = 9,
                    UserId = 2
                },
                new TaskComment
                {
                    Id = 10,
                    Comment = "Aún no se ha realizado el test inicial, pendiente de QA",
                    CreatedAt = DateTime.UtcNow,
                    TaskId = 10,
                    UserId = 3
                }
            );
        }
    }
}
