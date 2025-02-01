import { BoardRole } from "../api/interfaces/board";
import { TaskInterface } from "../api/interfaces/task";

export function capitalize(text: string): string {
  
  return text.charAt(0).toLocaleUpperCase() + text.substring(1);
}

export function returnTaskTextLength(tasks: TaskInterface[]): string {
  return `${tasks.length} ${tasks.length === 1 ? "Tarea" : "Tareas"}`;
}

export const getBadgeColor = (role?: BoardRole) => {
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