import { getAllTaskUser } from "@/lib/api/taskService";
import { ApiResponseTypes } from "@/types/apiResponse";
import { Task, TaskPriority, TaskStatus } from "@/types/tasks";
import { useEffect, useState } from "react";

export interface ProcessedTask extends Task {
  statusName: string;
  priorityName: string;
  assigneeName: string;
}

const statusTranslations: { [key: string]: string } = {
  "ToDo": "Por hacer",
  "InProgress": "En progreso",
  "Completed": "Completado"
};

const priorityTranslations: { [key: string]: string } = {
  "Low": "Baja",
  "Medium": "Media",
  "High": "Alta",
  "Critical": "Crítica"
};

export function useTasks() {
  const [tasks, setTasks] = useState<ProcessedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await getAllTaskUser().then(({ detail, result }) => {
          if (result === ApiResponseTypes[ApiResponseTypes.success]) {
            const processedTasks = detail.map((task): ProcessedTask => {
              let statusName = "Sin estado";
              if (task.status) {
                if (typeof task.status === 'string') {
                  statusName = statusTranslations[task.status] || task.status;
                } else if (typeof task.status === 'number') {
                  switch (task.status) {
                    case TaskStatus.ToDo: statusName = "Por hacer"; break;
                    case TaskStatus.InProgress: statusName = "En progreso"; break;
                    case TaskStatus.Completed: statusName = "Completado"; break;
                  }
                }
              }


              let priorityName = "Sin prioridad";
              if (task.priority) {
                if (typeof task.priority === 'string') {
                  priorityName = priorityTranslations[task.priority] || task.priority;
                } else if (typeof task.priority === 'number') {
                  switch (task.priority) {
                    case TaskPriority.Low: priorityName = "Baja"; break;
                    case TaskPriority.Medium: priorityName = "Media"; break;
                    case TaskPriority.High: priorityName = "Alta"; break;
                    case TaskPriority.Critical: priorityName = "Crítica"; break;
                  }
                }
              }


              const assigneeName = task.assignedUser
                ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}`
                : "Sin asignar";

              return {
                ...task,
                statusName,
                priorityName,
                assigneeName
              };
            });

            setTasks(processedTasks);
          }
        });
      } catch (error: any) {
        console.error(error);
        setError(error?.message || "Error al cargar las tareas");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { tasks, loading, error };
}