import { AssignedUser, BoardRole } from "../api/interfaces/board";

interface AssignedUsersProps {
  assignedUsers: AssignedUser[];
}

// Función para asignar colores según el rol del usuario
const getBadgeColor = (role?: BoardRole) => {
  switch (role) {
    case "Owner":
      return "bg-red-100 text-red-700"; 
    case "Admin":
      return "bg-blue-100 text-blue-700";
    case "User":
      return "bg-green-100 text-green-700";
    case "Viewer":
      return "bg-gray-100 text-gray-700"; 
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export const AssignedUsers = ({ assignedUsers }: AssignedUsersProps) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">Usuarios Asignados</label>
      <div className="flex flex-wrap gap-2 mt-1">
        {assignedUsers.length > 0 ? (
          assignedUsers.map((user) => (
            <span
              key={user.email}
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getBadgeColor(user.role)}`}
            >
              {user.firstName} {user.lastName} ({user.role})
            </span>
          ))
        ) : (
          <p className="text-sm text-gray-500">No hay usuarios asignados.</p>
        )}
      </div>
    </div>
  );
};
