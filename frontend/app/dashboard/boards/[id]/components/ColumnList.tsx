import React from "react";
import { BoardColumn } from "@/types/boardColumn";
import { Task } from "@/types/tasks";
import TaskColumn from "./TaskColumn";

interface ColumnListProps {
  filteredColumns: BoardColumn[];
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

export default function ColumnList({
  filteredColumns,
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
}: ColumnListProps) {
  return (
    <div className="flex-1 overflow-x-auto pb-4">
      <div className="flex gap-4">
        {filteredColumns.map((column: BoardColumn) => (
          <TaskColumn
            key={column.id}
            column={column}
            isViewer={isViewer}
            searchTerm={searchTerm}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragStart={handleDragStart}
            getResaltedText={getResaltedText}
            formatDate={formatDate}
            getPriorityColor={getPriorityColor}
            setSelectedTask={setSelectedTask}
            setSelectedColumnId={setSelectedColumnId}
            setIsNewTaskDialogOpen={setIsNewTaskDialogOpen}
          />
        ))}
      </div>
    </div>
  );
} 