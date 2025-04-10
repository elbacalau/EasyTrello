using backend.Data;
using backend.Models;
using backend.src.DTOs.PermissionDTOs;
using backend.src.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.src.Services
{
    public class PermissionService
    {
        private readonly AppDbContext _context;

        public PermissionService(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<PermissionType> GetRolePermissions(BoardRole role)
        {
            return role switch
            {
                BoardRole.Owner => GetOwnerPermissions(),
                BoardRole.Admin => GetAdminPermissions(),
                BoardRole.User => GetUserPermissions(),
                BoardRole.Viewer => GetViewerPermissions(),
                _ => []
            };
        }

        
        public async Task<bool> UserHasPermissionAsync(int userId, int boardId, PermissionType permission)
        {
            
            var boardUser = await _context.BoardUsers
                .FirstOrDefaultAsync(bu => bu.UserId == userId && bu.BoardId == boardId);

            if (boardUser == null)
                return false;

            var rolePermissions = GetRolePermissions(boardUser.Role);
            if (rolePermissions.Contains(permission))
                return true;

            var customPermission = await _context.BoardUserPermissions
                .FirstOrDefaultAsync(p => p.UserId == userId && 
                                         p.BoardId == boardId && 
                                         p.Permission.Code == permission.ToString());

            return customPermission?.IsGranted ?? false;
        }

        public async Task<UserPermissionResponse> GetUserPermissionsAsync(int userId, int boardId)
        {
            var boardUser = await _context.BoardUsers
                .FirstOrDefaultAsync(bu => bu.UserId == userId && bu.BoardId == boardId);

            if (boardUser == null)
                throw new ArgumentException("El usuario no está asignado a este tablero");

            var rolePermissions = GetRolePermissions(boardUser.Role);
            
            var customPermissions = await _context.BoardUserPermissions
                .Where(p => p.UserId == userId && p.BoardId == boardId)
                .Include(p => p.Permission)
                .ToListAsync();

            var allPermissions = Enum.GetValues(typeof(PermissionType))
                .Cast<PermissionType>()
                .ToList();

            var response = new UserPermissionResponse
            {
                UserId = userId,
                BoardId = boardId,
                Role = boardUser.Role,
                RoleName = boardUser.Role.ToString(),
                Permissions = []
            };

            foreach (var perm in allPermissions)
            {
                var customPerm = customPermissions.FirstOrDefault(p => p.Permission.Code == perm.ToString());
                
                var isGranted = rolePermissions.Contains(perm);
                if (customPerm != null)
                {
                    isGranted = customPerm.IsGranted;
                }

                response.Permissions.Add(new PermissionInfo
                {
                    Id = (int)perm,
                    Name = FormatPermissionName(perm.ToString()),
                    Code = perm.ToString(),
                    IsGranted = isGranted
                });
            }

            return response;
        }

        public async Task AssignRolePermissionsAsync(int userId, int boardId, BoardRole role)
        {
            var permissions = GetRolePermissions(role);
            
            foreach (var permType in permissions)
            {
                var permission = await GetOrCreatePermissionAsync(permType);
                
                var boardUserPermission = new BoardUserPermission
                {
                    BoardId = boardId,
                    UserId = userId,
                    PermissionId = permission.Id,
                    IsGranted = true
                };
                
                _context.BoardUserPermissions.Add(boardUserPermission);
            }
            
            await _context.SaveChangesAsync();
        }
        
        private async Task<Permission> GetOrCreatePermissionAsync(PermissionType permissionType)
        {
            var permCode = permissionType.ToString();
            var permission = await _context.Permissions
                .FirstOrDefaultAsync(p => p.Code == permCode);
                
            if (permission == null)
            {
                permission = new Permission
                {
                    Name = FormatPermissionName(permCode),
                    Code = permCode,
                    Description = $"Permite {FormatPermissionName(permCode).ToLower()}"
                };
                
                _context.Permissions.Add(permission);
                await _context.SaveChangesAsync();
            }
            
            return permission;
        }
        
        private string FormatPermissionName(string permissionCode)
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

        private IEnumerable<PermissionType> GetOwnerPermissions()
        {
            return Enum.GetValues(typeof(PermissionType))
                      .Cast<PermissionType>();
        }

        private IEnumerable<PermissionType> GetAdminPermissions()
        {
            return GetOwnerPermissions()
                .Except(new[] { PermissionType.DeleteBoard });
        }

        private IEnumerable<PermissionType> GetUserPermissions()
        {
            return new[]
            {
                PermissionType.ViewBoard,
                PermissionType.EditBoard,
                PermissionType.ManageColumns,
                PermissionType.CreateTask,
                PermissionType.ViewTask,
                PermissionType.EditTask,
                PermissionType.DeleteTask,
                PermissionType.AssignTask,
                PermissionType.MoveTask,
                PermissionType.CreateComment,
                PermissionType.ViewComment,
                PermissionType.EditComment,
                PermissionType.DeleteComment
            };
        }

        private IEnumerable<PermissionType> GetViewerPermissions()
        {
            return new[]
            {
                PermissionType.ViewBoard,
                PermissionType.ViewTask,
                PermissionType.ViewComment
            };
        }
    }
}