using backend.Data;
using backend.Models;
using backend.src.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace backend.src.Services
{
    public class DbInitializerService(AppDbContext context, PermissionService permissionService)
    {
        private readonly AppDbContext _context = context;
        private readonly PermissionService _permissionService = permissionService;

        public async Task InitializePermissionsAsync()
        {
            Console.WriteLine("Inicializando permisos...");
            
            if (await _context.Permissions.AnyAsync())
            {
                Console.WriteLine("Los permisos ya han sido inicializados.");
                return;
            }

            foreach (PermissionType permType in Enum.GetValues(typeof(PermissionType)))
            {
                var permCode = permType.ToString();
                var perm = new Permission
                {
                    Name = FormatPermissionName(permCode),
                    Code = permCode,
                    Description = $"Permite {FormatPermissionName(permCode).ToLower()}"
                };

                _context.Permissions.Add(perm);
            }

            await _context.SaveChangesAsync();
            Console.WriteLine("Permisos inicializados correctamente.");

            await AssignPermissionsToExistingUsers();
        }

        private async Task AssignPermissionsToExistingUsers()
        {
            Console.WriteLine("Asignando permisos a usuarios existentes...");
            
            var boardUsers = await _context.BoardUsers.ToListAsync();
            
            foreach (var boardUser in boardUsers)
            {
                await _permissionService.AssignRolePermissionsAsync(
                    boardUser.UserId, 
                    boardUser.BoardId, 
                    boardUser.Role);
            }
            
            Console.WriteLine($"Permisos asignados a {boardUsers.Count} relaciones usuario-tablero.");
        }
        
        private static string FormatPermissionName(string permissionCode)
        {
            return permissionCode switch
            {
                "CreateBoard" => "Crear Tablero",
                "ViewBoard" => "Ver Tablero",
                "EditBoard" => "Editar Tablero",
                "DeleteBoard" => "Eliminar Tablero",
                "ManageColumns" => "Gestionar Columnas",
                "InviteUsers" => "Invitar Usuarios",
                "CreateTask" => "Crear Tarea",
                "ViewTask" => "Ver Tarea",
                "EditTask" => "Editar Tarea",
                "DeleteTask" => "Eliminar Tarea",
                "AssignTask" => "Asignar Tarea",
                "MoveTask" => "Mover Tarea",
                "CreateComment" => "Crear Comentario",
                "ViewComment" => "Ver Comentario",
                "EditComment" => "Editar Comentario",
                "DeleteComment" => "Eliminar Comentario",
                "ManagePermissions" => "Gestionar Permisos",
                "ViewAuditLog" => "Ver Registro de Auditoría",
                _ => permissionCode
            };
        }
    }
} 