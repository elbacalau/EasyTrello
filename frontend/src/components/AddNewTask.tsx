import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface TaskInfoProps {
  onClose: () => void;
}

export interface CreateTaskRequest {
  name: string;
  description: string;
  dueDate: Date;
  status: string;
  priority: string;
  completed: boolean;
  labels: string[];
}

export default function AddNewTask({ onClose }: TaskInfoProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

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
        className={`bg-white p-6 rounded-lg shadow-lg max-w-xl w-full transform transition-all duration-300 ${
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
        {/* resto de contenido */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md"
              placeholder="Nombre de la tarea"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Descripción
            </label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md"
              placeholder="Descripción"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Fecha límite
            </label>
            <input
              type="date"
              className="w-full mt-1 p-2 border rounded-md"
              placeholder="Nombre de la tarea"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Estatus</label>

            <select className="w-full mt-1 p-2 border rounded-md">
              <option value="Pending">Pendiente</option>
              <option value="In Progress">En Progreso</option>
              <option value="Completed">Completado</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Prioridad</label>

            <select className="w-full mt-1 p-2 border rounded-md">
              <option value="Pending">Low</option>
              <option value="In Progress">Medium</option>
              <option value="Completed">High</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
