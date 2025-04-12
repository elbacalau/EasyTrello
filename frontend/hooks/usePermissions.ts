import { useState, useEffect, useCallback } from 'react';
import { Permission, hasPermission, hasRole, isOwner, isAdminOrOwner } from '../types/permission';
import { PermissionType, BoardRole } from '../types/permissionEnum';
import { getPermissions } from '@/lib/api/auth';


export const usePermissions = (boardId?: number) => {
    const [permissions, setPermissions] = useState<Permission | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadPermissions = useCallback(async () => {
        if (!boardId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getPermissions(boardId);

            if (response.result === 'success') {
                setPermissions(response.detail);
            } else {
                setError('Error al cargar los permisos');
            }
        } catch (err) {
            setError('Error al cargar los permisos');
            console.error('Error cargando permisos:', err);
        } finally {
            setLoading(false);
        }
    }, [boardId]);

    useEffect(() => {
        loadPermissions();
    }, [loadPermissions]);

    const can = useCallback((permissionType: PermissionType): boolean => {
        return hasPermission(permissions, permissionType);
    }, [permissions]);

    const hasRoleOf = useCallback((roles: BoardRole[]): boolean => {
        return hasRole(permissions, roles);
    }, [permissions]);

    const isOwnerOfBoard = useCallback((): boolean => {
        return isOwner(permissions);
    }, [permissions]);

    const isAdminOrOwnerOfBoard = useCallback((): boolean => {
        return isAdminOrOwner(permissions);
    }, [permissions]);

    const isViewer = useCallback((): boolean => {
        return hasRole(permissions, [BoardRole.Viewer]);
    }, [permissions]);

    return {
        permissions,
        loading,
        error,
        can,
        hasRoleOf,
        isOwner: isOwnerOfBoard,
        isAdminOrOwner: isAdminOrOwnerOfBoard,
        isViewer,
        reload: loadPermissions
    };
}; 