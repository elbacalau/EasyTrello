"use client";

import { Card } from "@/components/ui/card";
import { useTasks } from "./hooks/useTasks";
import { useTaskFilters } from "./hooks/useTaskFilters";
import { TaskFilters } from "./components/TaskFilters";
import { TaskTable } from "./components/TaskTable";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function BacklogPage() {
  const { tasks, error } = useTasks();

  const {
    searchQuery,
    setSearchQuery,
    sortColumn,
    sortDirection,
    selectedStatus,
    setSelectedStatus,
    selectedPriority,
    setSelectedPriority,
    selectedAssignee,
    setSelectedAssignee,
    selectedBoard,
    setSelectedBoard,
    statuses,
    priorities,
    assignees,
    boardsForSelect,
    filteredAndSortedTasks,
    handleSort,
  } = useTaskFilters({ tasks });

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="text-destructive text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold mb-2">
            Error al cargar las tareas
          </h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        selectedAssignee={selectedAssignee}
        setSelectedAssignee={setSelectedAssignee}
        selectedBoard={selectedBoard}
        setSelectedBoard={setSelectedBoard}
        statuses={statuses}
        priorities={priorities}
        assignees={assignees}
        boardsForSelect={boardsForSelect}
        taskCount={filteredAndSortedTasks.length}
      />

      <Card>
        <TaskTable
          tasks={filteredAndSortedTasks}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          handleSort={handleSort}
        />
      </Card>
    </div>
  );
}
