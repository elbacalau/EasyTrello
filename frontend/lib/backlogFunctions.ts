import { TaskPriority, TaskStatus } from "@/types/tasks";

export const getStatusColor = (status?: string | number) => {
  if (typeof status === "string") {
    switch (status) {
      case "ToDo":
        return "bg-slate-500";
      case "InProgress":
        return "bg-amber-500";
      case "Completed":
        return "bg-green-500";
      default:
        return "bg-slate-500";
    }
  } else {
    switch (status) {
      case TaskStatus.ToDo:
        return "bg-slate-500";
      case TaskStatus.InProgress:
        return "bg-amber-500";
      case TaskStatus.Completed:
        return "bg-green-500";
      default:
        return "bg-slate-500";
    }
  }
};

export const getPriorityColor = (priority?: string | number) => {
  if (typeof priority === "string") {
    switch (priority) {
      case "Critical":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  } else {
    switch (priority) {
      case TaskPriority.Critical:
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case TaskPriority.High:
        return "bg-destructive/10 text-destructive border-destructive/20";
      case TaskPriority.Medium:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case TaskPriority.Low:
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  }
};