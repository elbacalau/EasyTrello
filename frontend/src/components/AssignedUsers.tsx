import { AssignedUser } from "../api/interfaces/board";
import { getBadgeColor } from "../utils/helpers";

interface AssignedUsersProps {
  assignedUsers: AssignedUser[];
}



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
