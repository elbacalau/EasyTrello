namespace backend.src.Models
{
    public enum PermissionType
    {
        // BOARDS PERMISSIONS
        CreateBoard = 100,
        ViewBoard = 101,
        EditBoard = 102,
        DeleteBoard = 103,
        ManageColumns = 104,
        InviteUsers = 105,
        
        // TASKS PERMISSIONS
        CreateTask = 200,
        ViewTask = 201,
        EditTask = 202,
        DeleteTask = 203,
        AssignTask = 204,
        MoveTask = 205,
        
        // COMMENTS PERMISSIONS
        CreateComment = 300,
        ViewComment = 301,
        EditComment = 302,
        DeleteComment = 303,
        
        // ADMINISTRATIVE PERMISSIONS
        ManagePermissions = 900,
        ViewAuditLog = 901
    }
} 