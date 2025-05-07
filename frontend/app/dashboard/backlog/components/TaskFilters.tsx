import React from "react";
import { Search, Filter, SlidersHorizontal, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface TaskFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedStatus: string[];
  setSelectedStatus: (value: string[]) => void;
  selectedPriority: string[];
  setSelectedPriority: (value: string[]) => void;
  selectedAssignee: string[];
  setSelectedAssignee: (value: string[]) => void;
  selectedBoard: string;
  setSelectedBoard: (value: string) => void;
  statuses: string[];
  priorities: string[];
  assignees: string[];
  boardsForSelect: string[];
  taskCount: number;
}

export function TaskFilters({
  searchQuery,
  setSearchQuery,
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
  taskCount,
}: TaskFiltersProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Backlog</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar tareas..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Breadcrumb
        segments={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Backlog", href: "/dashboard/backlog", current: true },
        ]}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={selectedBoard} onValueChange={setSelectedBoard}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Todos los tableros" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_todos_">Todos los tableros</SelectItem>
              {boardsForSelect.map((boardName) => (
                <SelectItem key={boardName} value={boardName}>
                  {boardName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Estado
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {statuses.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={selectedStatus.includes(status)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedStatus([...selectedStatus, status]);
                    } else {
                      setSelectedStatus(
                        selectedStatus.filter((s) => s !== status)
                      );
                    }
                  }}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Prioridad
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {priorities.map((priority) => (
                <DropdownMenuCheckboxItem
                  key={priority}
                  checked={selectedPriority.includes(priority)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPriority([...selectedPriority, priority]);
                    } else {
                      setSelectedPriority(
                        selectedPriority.filter((p) => p !== priority)
                      );
                    }
                  }}
                >
                  {priority}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <User className="h-4 w-4 mr-2" />
                Asignado
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {assignees.map((assignee) => (
                <DropdownMenuCheckboxItem
                  key={assignee}
                  checked={selectedAssignee.includes(assignee)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedAssignee([...selectedAssignee, assignee]);
                    } else {
                      setSelectedAssignee(
                        selectedAssignee.filter((a) => a !== assignee)
                      );
                    }
                  }}
                >
                  {assignee}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-sm text-muted-foreground">
          {taskCount} {taskCount === 1 ? "tarea" : "tareas"}
        </div>
      </div>
    </>
  );
}
