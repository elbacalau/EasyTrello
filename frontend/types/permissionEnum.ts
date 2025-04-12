export enum PermissionType {
    // PERMISOS DE TABLEROS
    CreateBoard = 100,
    ViewBoard = 101,
    EditBoard = 102,
    DeleteBoard = 103,
    ManageColumns = 104,
    InviteUsers = 105,
    
    // PERMISOS DE TAREAS
    CreateTask = 200,
    ViewTask = 201,
    EditTask = 202,
    DeleteTask = 203,
    AssignTask = 204,
    MoveTask = 205,
    
    // PERMISOS DE COMENTARIOS
    CreateComment = 300,
    ViewComment = 301,
    EditComment = 302,
    DeleteComment = 303,
    
    // PERMISOS ADMINISTRATIVOS
    ManagePermissions = 900,
    ViewAuditLog = 901
}


export enum BoardRole {
    Owner = 1,
    Admin = 2,
    User = 3,
    Viewer = 4
}


export function getPermissionName(permission: PermissionType): string {
    const names: Record<PermissionType, string> = {
        [PermissionType.CreateBoard]: "Crear Tablero",
        [PermissionType.ViewBoard]: "Ver Tablero",
        [PermissionType.EditBoard]: "Editar Tablero",
        [PermissionType.DeleteBoard]: "Eliminar Tablero",
        [PermissionType.ManageColumns]: "Gestionar Columnas",
        [PermissionType.InviteUsers]: "Invitar Usuarios",
        
        [PermissionType.CreateTask]: "Crear Tarea",
        [PermissionType.ViewTask]: "Ver Tarea",
        [PermissionType.EditTask]: "Editar Tarea",
        [PermissionType.DeleteTask]: "Eliminar Tarea",
        [PermissionType.AssignTask]: "Asignar Tarea",
        [PermissionType.MoveTask]: "Mover Tarea",
        
        [PermissionType.CreateComment]: "Crear Comentario",
        [PermissionType.ViewComment]: "Ver Comentario",
        [PermissionType.EditComment]: "Editar Comentario",
        [PermissionType.DeleteComment]: "Eliminar Comentario",
        
        [PermissionType.ManagePermissions]: "Gestionar Permisos",
        [PermissionType.ViewAuditLog]: "Ver Registro de Auditoría"
    };
    
    return names[permission] || `Permiso desconocido (${permission})`;
}


export function getRoleName(role: BoardRole): string {
    const names: Record<BoardRole, string> = {
        [BoardRole.Owner]: "Propietario",
        [BoardRole.Admin]: "Administrador",
        [BoardRole.User]: "Usuario",
        [BoardRole.Viewer]: "Visualizador"
    };
    
    return names[role] || `Rol desconocido (${role})`;
}


export interface PermissionCategory {
    name: string;
    permissions: PermissionType[];
}


export function getPermissionCategories(): PermissionCategory[] {
    return [
        {
            name: "Tableros",
            permissions: [
                PermissionType.CreateBoard,
                PermissionType.ViewBoard,
                PermissionType.EditBoard,
                PermissionType.DeleteBoard,
                PermissionType.ManageColumns,
                PermissionType.InviteUsers
            ]
        },
        {
            name: "Tareas",
            permissions: [
                PermissionType.CreateTask,
                PermissionType.ViewTask,
                PermissionType.EditTask,
                PermissionType.DeleteTask,
                PermissionType.AssignTask,
                PermissionType.MoveTask
            ]
        },
        {
            name: "Comentarios",
            permissions: [
                PermissionType.CreateComment,
                PermissionType.ViewComment,
                PermissionType.EditComment,
                PermissionType.DeleteComment
            ]
        },
        {
            name: "Administración",
            permissions: [
                PermissionType.ManagePermissions,
                PermissionType.ViewAuditLog
            ]
        }
    ];
} 