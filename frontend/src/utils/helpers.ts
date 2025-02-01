import { TaskInterface } from "../api/interfaces/task";

export function capitalize(text: string): string {
  
  return text.charAt(0).toLocaleUpperCase() + text.substring(1);
}

export function returnTaskTextLength(tasks: TaskInterface[]): string {
  return `${tasks.length} ${tasks.length === 1 ? "Tarea" : "Tareas"}`;
}

