import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProcessedTask } from "./useTasks";
import { RootState } from "@/store/store";
import {
  setSearchQuery,
  setSortColumn,
  setSortDirection,
  setSelectedStatus,
  setSelectedPriority,
  setSelectedAssignee,
  setSelectedBoard,
} from "@/store/slices/filterSlice";

interface UseTaskFiltersProps {
  tasks: ProcessedTask[];
}

export function useTaskFilters({ tasks }: UseTaskFiltersProps) {
  const dispatch = useDispatch();
  const {
    searchQuery,
    sortColumn,
    sortDirection,
    selectedStatus,
    selectedPriority,
    selectedAssignee,
    selectedBoard,
  } = useSelector((state: RootState) => state.filters);

  const statuses = useMemo(() => {
    if (tasks.length === 0) return [];
    return [...new Set(tasks.map((task) => task.statusName).filter(Boolean))];
  }, [tasks]);

  const priorities = useMemo(() => {
    if (tasks.length === 0) return [];
    return [...new Set(tasks.map((task) => task.priorityName).filter(Boolean))];
  }, [tasks]);

  const assignees = useMemo(() => {
    if (tasks.length === 0) return [];
    return [...new Set(tasks.map((task) => task.assigneeName).filter(Boolean))];
  }, [tasks]);

  const boardsForSelect = useMemo(() => {
    const validBoards: string[] = [];
    tasks.forEach(task => {
      if (task.boardName && task.boardName.trim() !== '') {
        if (!validBoards.includes(task.boardName)) {
          validBoards.push(task.boardName);
        }
      }
    });
    return validBoards;
  }, [tasks]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      dispatch(setSortDirection(sortDirection === "asc" ? "desc" : "asc"));
    } else {
      dispatch(setSortColumn(column));
      dispatch(setSortDirection("asc"));
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          searchQuery === "" ||
          (task.name && task.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus =
          selectedStatus.length === 0 || (task.statusName && selectedStatus.includes(task.statusName));

        const matchesPriority =
          selectedPriority.length === 0 || (task.priorityName && selectedPriority.includes(task.priorityName));

        const matchesAssignee =
          selectedAssignee.length === 0 || (task.assigneeName && selectedAssignee.includes(task.assigneeName));

        const matchesBoard =
          selectedBoard === "_todos_" ||
          (task.boardName === selectedBoard);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority &&
          matchesAssignee &&
          matchesBoard
        );
      })
      .sort((a, b) => {
        if (sortColumn === "name") {
          return sortDirection === "asc"
            ? (a.name || "").localeCompare(b.name || "")
            : (b.name || "").localeCompare(a.name || "");
        } else if (sortColumn === "board") {
          return sortDirection === "asc"
            ? (a.boardName || "").localeCompare(b.boardName || "")
            : (b.boardName || "").localeCompare(a.boardName || "");
        } else if (sortColumn === "status") {
          return sortDirection === "asc"
            ? a.statusName.localeCompare(b.statusName)
            : b.statusName.localeCompare(a.statusName);
        } else if (sortColumn === "priority") {
          const getPriorityValue = (name: string) => {
            if (name.includes("Critical")) return 4;
            if (name.includes("High")) return 3;
            if (name.includes("Medium")) return 2;
            if (name.includes("Low")) return 1;
            return 0;
          };

          const aPriority = getPriorityValue(a.priorityName);
          const bPriority = getPriorityValue(b.priorityName);

          return sortDirection === "asc"
            ? aPriority - bPriority
            : bPriority - aPriority;
        } else if (sortColumn === "dueDate") {
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return sortDirection === "asc"
            ? aDate - bDate
            : bDate - aDate;
        } else if (sortColumn === "assignee") {
          return sortDirection === "asc"
            ? a.assigneeName.localeCompare(b.assigneeName)
            : b.assigneeName.localeCompare(a.assigneeName);
        }
        return 0;
      });
  }, [
    tasks,
    searchQuery,
    sortColumn,
    sortDirection,
    selectedStatus,
    selectedPriority,
    selectedAssignee,
    selectedBoard,
  ]);

  return {
    searchQuery,
    setSearchQuery: (value: string) => dispatch(setSearchQuery(value)),
    sortColumn,
    sortDirection,
    selectedStatus,
    setSelectedStatus: (value: string[]) => dispatch(setSelectedStatus(value)),
    selectedPriority,
    setSelectedPriority: (value: string[]) => dispatch(setSelectedPriority(value)),
    selectedAssignee,
    setSelectedAssignee: (value: string[]) => dispatch(setSelectedAssignee(value)),
    selectedBoard,
    setSelectedBoard: (value: string) => dispatch(setSelectedBoard(value)),
    statuses,
    priorities,
    assignees,
    boardsForSelect,
    filteredAndSortedTasks,
    handleSort,
  };
} 