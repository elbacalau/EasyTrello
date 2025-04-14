import React from "react";
import { BoardColumn } from "@/types/boardColumn";
import { Task } from "@/types/tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TaskItem from "./TaskItem";

interface TaskColumnProps {
  column: BoardColumn;
  isViewer: () => boolean;
  searchTerm: string;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (columnId: number | undefined) => void;
  handleDragStart: (task: Task, columnId: number | undefined) => void;
  getResaltedText: (term: string, text?: string) => React.ReactNode;
  formatDate: (date: string | Date | null) => string;
  getPriorityColor: (priority: any) => string;
  setSelectedTask: (task: Task) => void;
  setSelectedColumnId: (id: number | null) => void;
  setIsNewTaskDialogOpen: (isOpen: boolean) => void;
}

export default function TaskColumn({
  column,
  isViewer,
  searchTerm,
  handleDragOver,
  handleDrop,
  handleDragStart,
  getResaltedText,
  formatDate,
  getPriorityColor,
  setSelectedTask,
  setSelectedColumnId,
  setIsNewTaskDialogOpen,
}: TaskColumnProps) {
  return (
    <div
      key={column.id}
      className="flex-shrink-0 w-80"
      onDragOver={isViewer() ? undefined : handleDragOver}
      onDrop={isViewer() ? undefined : () => handleDrop(column.id)}
    >
      <Card className="h-full">
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {column.columnName} ({column.tasks?.length || 0})
            </CardTitle>
            {isViewer() ? null : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setSelectedColumnId(column.id!);
                  setIsNewTaskDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add task</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 overflow-y-auto max-h-[calc(100vh-300px)]">
          <div className="space-y-3">
            {column.tasks?.map((task: Task) => (
              <TaskItem
                key={task.id}
                task={task}
                columnId={column.id!}
                searchTerm={searchTerm}
                handleDragStart={handleDragStart}
                getResaltedText={getResaltedText}
                formatDate={formatDate}
                getPriorityColor={getPriorityColor}
                setSelectedTask={setSelectedTask}
                setSelectedColumnId={setSelectedColumnId}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 