import { useEffect, useState } from "react";
import { TaskInterface } from "../api/interfaces/task";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CommentsComponent from "./Comments";
import { AssignedUsers } from "./AssignedUsers";
import { AssignedUser } from "../api/interfaces/board";

interface TaskInfoProps {
  task: TaskInterface;
  onClose: () => void;
  editingEnabled?: boolean;
  assignedUsers: AssignedUser[];
}

export default function TaskInfo({
  task,
  onClose,
  editingEnabled,
  assignedUsers,
}: TaskInfoProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };


  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg max-w-lg w-full transform transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Detalles de la Tarea
          </h3>
          <button onClick={handleClose}>
            <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              className="w-full mt-1 p-2 border rounded-md"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pendiente</option>
                <option value="In Progress">En Progreso</option>
                <option value="Completed">Completado</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Prioridad
              </label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Baja</option>
                <option value="Medium">Media</option>
                <option value="High">Alta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Etiquetas */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Etiquetas
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {task.labels!.map((label, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* usuarios asignados a la tarea */}
            <AssignedUsers assignedUsers={assignedUsers} />
          </div>

          {/* comentarios */}
          <CommentsComponent
            comments={task.comments ?? []}
            onDelete={() => {}}
          />

          <button
            className={`mt-4 w-full py-2 text-white rounded-md transition ${
              editingEnabled
                ? "bg-green-600 hover:bg-green-500 cursor-pointer"
                : "bg-gray-700 cursor-not-allowed"
            }`}
            onClick={() => {}}
            disabled={editingEnabled}
          >
            Guardar Cambios
          </button>

          <button
            className="mt-2 w-full py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400 transition"
            onClick={handleClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
