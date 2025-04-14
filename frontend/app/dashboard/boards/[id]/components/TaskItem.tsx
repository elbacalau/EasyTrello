import React from "react";
import { Task } from "@/types/tasks";
import { Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TaskItemProps {
  task: Task;
  columnId: number;
  searchTerm: string;
  handleDragStart: (task: Task, columnId: number) => void;
  getResaltedText: (term: string, text?: string) => React.ReactNode;
  formatDate: (date: string | Date | null) => string;
  getPriorityColor: (priority: any) => string;
  setSelectedTask: (task: Task) => void;
  setSelectedColumnId: (columnId: number) => void;
}

export default function TaskItem({
  task,
  columnId,
  searchTerm,
  handleDragStart,
  getResaltedText,
  formatDate,
  getPriorityColor,
  setSelectedTask,
  setSelectedColumnId,
}: TaskItemProps) {
  return (
    <div
      key={task.id}
      draggable
      onDragStart={() => handleDragStart(task, columnId)}
      className="rounded-md border bg-card shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing"
    >
      <div
        className="p-3 space-y-3"
        onClick={() => {
          setSelectedTask(task);
          setSelectedColumnId(task.boardColumnId!);
        }}
      >
        <div className="font-medium">
          {searchTerm
            ? getResaltedText(searchTerm, task.name)
            : task.name}
        </div>
        <div className="flex items-center justify-between">
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              {formatDate(task.dueDate)}
            </div>
          )}
          <div
            className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
              task.priority!
            )}`}
          >
            {task.priority}
          </div>
        </div>
        {task.assignedUserId && task.assignedUser && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={`https://i.pravatar.cc/150?u=${task.assignedUser.firstName}`}
                  alt={task.assignedUser.firstName || ""}
                />
                <AvatarFallback>
                  {task.assignedUser.firstName?.[0] || ""}
                  {task.assignedUser.lastName?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {task.assignedUser.firstName}{" "}
                {task.assignedUser.lastName}
              </span>
            </div>
            {task.comments?.length && task.comments.length > 0 ? (
              <div className="text-xs text-muted-foreground">
                {task.comments.length} comment
                {task.comments.length !== 1 ? "s" : ""}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                No comments
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 