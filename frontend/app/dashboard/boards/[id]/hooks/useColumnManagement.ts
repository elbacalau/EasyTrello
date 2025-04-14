import { useState, useEffect } from "react";
import { BoardColumn } from "@/types/boardColumn";
import { AssignedUser } from "@/types/userData";
import { ApiResponse, ApiResponseTypes } from "@/types/apiResponse";
import { fetchBoardColumns, fetchAssignedUsersBoard } from "@/lib/api/boardService";

export function useColumnManagement(boardId: number) {
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [filteredColumns, setFilteredColumns] = useState<BoardColumn[]>([]);
  const [teamMembers, setTeamMembers] = useState<AssignedUser[]>([]);
  const [selectedMember, setSelectedMember] = useState<AssignedUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadColumns = async () => {
    await fetchBoardColumns(boardId).then(
      ({ result, detail }: ApiResponse<BoardColumn[]>) => {
        if (result === ApiResponseTypes[ApiResponseTypes.success]) {
          setColumns(detail);
          
          if (selectedMember) {
            const filtered = detail.map((column) => ({
              ...column,
              tasks:
                column.tasks?.filter((task) => task.assignedUserId === selectedMember.id) || [],
            }));
            setFilteredColumns(filtered);
          } else {
            setFilteredColumns(detail);
          }
        }
      }
    );

    await fetchAssignedUsersBoard(boardId).then(
      ({ result, detail }: ApiResponse<AssignedUser[]>) => {
        if (result === ApiResponseTypes[ApiResponseTypes.success]) {
          setTeamMembers(detail);
        }
      }
    );
  };
  const handleSelectMember = (member: AssignedUser) => {
    if (member.id === null) return;
    setSelectedMember(member);
  };
  const clearFilters = () => {
    setSelectedMember(null);
    setSearchTerm("");
    setFilteredColumns(columns);
  };

  useEffect(() => {
    if (!columns.length) return;

    if (selectedMember && searchTerm) {
      const filtered = columns.map(column => ({
        ...column,
        tasks: column.tasks
          ?.filter(task => task.assignedUserId === selectedMember.id)
          ?.filter(task => 
            task.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase())
          ) || []
      }));
      setFilteredColumns(filtered);
    } 
    else if (searchTerm) {
      const filtered = columns.map(column => ({
        ...column,
        tasks: column.tasks
          ?.filter(task => 
            task.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase())
          ) || []
      }));
      setFilteredColumns(filtered);
    }
    else if (selectedMember) {
      const filtered = columns.map(column => ({
        ...column,
        tasks: column.tasks?.filter(task => task.assignedUserId === selectedMember.id) || []
      }));
      setFilteredColumns(filtered);
    }
    else {
      setFilteredColumns(columns);
    }
  }, [searchTerm, columns, selectedMember]);

  return {
    columns,
    filteredColumns,
    teamMembers,
    selectedMember,
    searchTerm,
    setSearchTerm,
    loadColumns,
    handleSelectMember,
    clearFilters
  };
} 