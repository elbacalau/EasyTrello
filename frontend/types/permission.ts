import { BoardRole, PermissionType } from './permissionEnum';

export interface Permission {
    userId?:      number;
    boardId?:     number;
    role?:        BoardRole;
    roleName?:    string;
    permissions?: PermissionElement[];
}

export interface PermissionElement {
    id?:        number | PermissionType;
    name?:      string;
    code?:      string;
    isGranted?: boolean;
}

export function hasPermission(
    userPermissions: Permission | undefined | null, 
    permissionType: PermissionType
): boolean {
    if (!userPermissions || !userPermissions.permissions) {
        return false;
    }
    
    const permission = userPermissions.permissions.find(
        p => p.id === permissionType || p.code === PermissionType[permissionType]
    );
    
    return permission?.isGranted || false;
}

export function hasRole(
    userPermissions: Permission | undefined | null,
    roles: BoardRole[]
): boolean {
    if (!userPermissions || userPermissions.role === undefined) {
        return false;
    }
    
    return roles.includes(userPermissions.role);
}

export function isOwner(userPermissions: Permission | undefined | null): boolean {
    return hasRole(userPermissions, [BoardRole.Owner]);
}


export function isAdminOrOwner(userPermissions: Permission | undefined | null): boolean {
    return hasRole(userPermissions, [BoardRole.Owner, BoardRole.Admin]);
}
