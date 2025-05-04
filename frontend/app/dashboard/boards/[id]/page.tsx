"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Task } from "@/types/tasks";
import { Board, UserData } from "@/types/userData";
import { useAppSelector } from "@/types/hooks";
import { usePermissions } from "@/hooks/usePermissions";

import { useTaskManagement } from "./hooks/useTaskManagement";
import { useCommentManagement } from "./hooks/useCommentManagement";
import { useColumnManagement } from "./hooks/useColumnManagement";
import { useFormatters } from "./hooks/useFormatters";

import BoardHeader from "./components/BoardHeader";
import TeamMemberFilter from "./components/TeamMemberFilter";
import ColumnList from "./components/ColumnList";
import NewTaskDialog from "./components/NewTaskDialog";
import SelectedTaskCard from "@/app/dashboard/boards/[id]/components/SelectedTask";

export default function BoardPage() {
  const params = useParams();
  const boardId = parseInt(params.id as string);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);

  const userData: UserData = useAppSelector((state) => state.user);
  const currentBoard: Board | undefined = useMemo(() => {
    return userData?.boards.find((board) => board.id === boardId);
  }, [boardId, userData]);

  const { can, isAdminOrOwner, isViewer } = usePermissions(boardId);
  
  const {
    columns,
    filteredColumns,
    teamMembers,
    selectedMember,
    searchTerm,
    setSearchTerm,
    loadColumns,
    handleSelectMember,
    clearFilters
  } = useColumnManagement(boardId);

  const {
    newTask,
    setNewTask,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleAddTask,
    handleDeleteTask,
    handleChangeUser
  } = useTaskManagement(boardId, loadColumns, setSelectedTask);

  const {
    newComment,
    setNewComment,
    handleAddComment,
    handleDeleteComment,
    handleCanDeleteComment
  } = useCommentManagement(boardId, userData, selectedTask, setSelectedTask, loadColumns);

  const formatters = useFormatters();

  useEffect(() => {
    loadColumns();
  }, [boardId]);

  return (
    <div className="space-y-6">
      <BoardHeader 
        currentBoard={currentBoard} 
        isAdminOrOwner={isAdminOrOwner} 
      />

      <TeamMemberFilter 
        teamMembers={teamMembers}
        selectedMember={selectedMember}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSelectMember={handleSelectMember}
        clearFilters={clearFilters}
      />

      <div className="flex flex-row gap-6 h-[calc(90vh-16rem)]">
        <ColumnList 
          filteredColumns={filteredColumns}
          isViewer={isViewer}
          searchTerm={searchTerm}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleDragStart={handleDragStart}
          getResaltedText={formatters.getResaltedText}
          formatDate={formatters.formatDate}
          getPriorityColor={formatters.getPriorityColor}
          setSelectedTask={setSelectedTask}
          setSelectedColumnId={setSelectedColumnId}
          setIsNewTaskDialogOpen={setIsNewTaskDialogOpen}
        />

        {selectedTask && (
          <SelectedTaskCard
            key={`task-${selectedTask.id}-${selectedTask.comments?.length || 0}`}
            teamMembers={teamMembers}
            selectedTask={selectedTask}
            newComment={newComment}
            columnId={selectedTask.boardColumnId || 0}
            setNewComment={setNewComment}
            handleAddComment={handleAddComment}
            formatDate={formatters.formatDate}
            formatCommentTime={formatters.formatCommentTime}
            getPriorityColor={formatters.getPriorityColor}
            handleDeleteTask={handleDeleteTask}
            handleDeleteComment={handleDeleteComment}
            canDeleteComment={handleCanDeleteComment}
            handleChangeUser={handleChangeUser}
          />
        )}
      </div>

      <NewTaskDialog
        isOpen={isNewTaskDialogOpen}
        onOpenChange={(open) => {
          setIsNewTaskDialogOpen(open);
          if (!open) setSelectedColumnId(null);
        }}
        newTask={newTask}
        setNewTask={setNewTask}
        selectedColumnId={selectedColumnId}
        filteredColumns={filteredColumns}
        teamMembers={teamMembers}
        handleAddTask={handleAddTask}
      />
    </div>
  );
}
