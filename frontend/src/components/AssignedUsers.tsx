import { useState } from "react";
import { AssignedUser } from "../api/interfaces/board";
import { getBadgeColor } from "../utils/helpers";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface AssignedUsersProps {
  assignedUsers: AssignedUser[];
}

export const AssignedUsers = ({ assignedUsers }: AssignedUsersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<AssignedUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<AssignedUser[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);

    if (query.length === 0) {
      setFilteredUsers([]);
    } else {
      const filtered = assignedUsers.filter((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  };

  const handleSelectedUser = (user: AssignedUser) => {
    if (!selectedUsers.some((selected) => selected.email === user.email)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchTerm("");
    setFilteredUsers([]);
  };

  const handleRemoveUser = (email: string): void => {
    const removedUserList = selectedUsers.filter((u) => u.email !== email);
    setSelectedUsers(removedUserList);
  };

  const handleAddUser = (boardId: number, taskId: number, userId: number, selectedListUsers: AssignedUser[]) => {
    // TODO: CREAR 2 BOTONES DEBAJO PARA AÑADIR O ELIMINAR USUARIOS
    // TODO: SEUGN EL QUE ESTE ACTIVADO SERA LA ACCION QUE SE TOME AL GUARDAR CAMBIOS
  }
  
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 flex">
        Usuarios
        {selectedUsers.length > 0 && (
          <button className="duration-150 hover:text-blue-500" onClick={() => handleAddUser}>
            {" "}
            <PlusCircleIcon className="size-5 ml-1" />{" "}
          </button>
        )}
      </label>

      {/* container de usuarios seleccionados */}
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedUsers.map((user) => (
          <span
            key={user.email}
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getBadgeColor(
              user.role
            )}`}
          >
            {user.firstName} {user.lastName} ({user.role})
            <button
              onClick={() => handleRemoveUser(user.email!)}
              className="ml-1 text-yellow-900 hover:text-red-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        placeholder="Buscar usuario..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full mt-1 border rounded-md p-2 text-sm"
      />

      {searchTerm && (
        <div className="mt-2 max-h-40 overflow-auto border rounded-md shadow-md bg-white">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.email}
                className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
              >
                <button onClick={() => handleSelectedUser(user)}>
                  {" "}
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium  ${getBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.firstName} {user.lastName} ({user.role})
                  </span>
                </button>
              </div>
            ))
          ) : (
            <p className="p-2 text-sm text-gray-500">
              No se encontraro usuarios
            </p>
          )}
        </div>
      )}
    </div>
  );
};
