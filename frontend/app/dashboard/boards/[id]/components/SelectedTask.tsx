import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Tag, Trash2, X } from "lucide-react";
import { Task, Comment } from "@/types/tasks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PermissionType } from "@/types/permissionEnum";
import { AssignedUser } from "@/types/userData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SelectedTaskCardProps {
  selectedTask: Task;
  newComment: string;
  columnId: number;
  teamMembers: AssignedUser[];
  canDeleteComment: (commentId: number) => boolean;
  setNewComment: (comment: string) => void;
  handleAddComment: () => void;
  formatDate: (dateString: string | Date | null) => string;
  formatCommentTime: (timestamp: string | Date | null) => string;
  getPriorityColor: (priority: number) => string;
  handleDeleteTask: (taskId: number, columnId: number) => void;
  handleDeleteComment: (commentId: number, taskId: number) => void;
  handleChangeUser: (taskId: number, userId: number, columnId: number) => void;
}

const CommentItem = ({
  comment,
  formatCommentTime,
  onDelete,
  canDeleteComment,
}: {
  comment: Comment;
  formatCommentTime: (timestamp: string | Date | null) => string;
  onDelete: (commentId: number) => void;
  canDeleteComment: (commentId: number) => boolean;
}) => {
  const [showDelete, setShowDelete] = useState(false);

  const canDelete = canDeleteComment(comment.id);

  return (
    <div
      className="flex gap-3 group relative p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={`https://i.pravatar.cc/150?u=${comment.userName}`}
          alt={comment.userName}
        />
        <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{comment.userName}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatCommentTime(comment.createdAt)}
            </span>

            {showDelete && canDelete && (
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                onClick={() => onDelete(comment.id!)}
                aria-label="Eliminar comentario"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm">{comment.comment}</p>
      </div>
    </div>
  );
};

const SelectedTaskCard: React.FC<SelectedTaskCardProps> = ({
  selectedTask,
  newComment,
  teamMembers,
  columnId,
  setNewComment,
  handleAddComment,
  formatDate,
  formatCommentTime,
  getPriorityColor,
  handleDeleteTask,
  handleDeleteComment,
  canDeleteComment,
  handleChangeUser,
}) => {
  const [showDispUsers, setShowDispUsers] = useState<boolean>(false);

  useEffect(() => {}, [selectedTask]);

  useEffect(() => {
    setShowDispUsers(false);
  }, [selectedTask?.assignedUserId]);

  const onDeleteComment = (commentId: number) => {
    handleDeleteComment(commentId, selectedTask.id!);
  };

  const onChangedAssignedUser = () => {
    setShowDispUsers(true);
  };

  const handleUserChange = (taskId: number, userId: number, columnId: number) => {
    handleChangeUser(taskId, userId, columnId);
    setShowDispUsers(false); 
  };

  return (
    <div className="w-[calc(50%-16rem)] h-fit">
      <Card className="h-[calc(80vh-7rem)] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex flex-row justify-between items-center">
            <CardTitle className="mr-4">{selectedTask.name}</CardTitle>

            <Button
              variant="ghost"
              className="hover:text-red-700 p-2 h-auto"
              onClick={() => handleDeleteTask(selectedTask.id!, columnId)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto flex-grow">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">
                {selectedTask.description || "No description provided"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Due Date</h3>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formatDate(selectedTask.dueDate || "") || "No due date"}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Priority</h3>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                    selectedTask.priority || 0
                  )}`}
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {selectedTask.priority}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Assignee</h3>
              <div className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors w-fit p-2 rounded-md cursor-pointer">
                {selectedTask.assignedUser ? (
                  <>
                    <Avatar className="h-8 w-8" onClick={onChangedAssignedUser}>
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?u=${selectedTask.assignedUser.firstName}`}
                        alt={selectedTask.assignedUser.firstName || ""}
                      />
                      <AvatarFallback>
                        {selectedTask.assignedUser.firstName?.[0] || ""}
                        {selectedTask.assignedUser.lastName?.[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {selectedTask.assignedUser.firstName}{" "}
                      {selectedTask.assignedUser.lastName}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Unassigned
                  </span>
                )}

                {showDispUsers ? (
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Asignar usuario
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {teamMembers.map((member) => (
                          <DropdownMenuItem
                            key={member.id}
                            onClick={() => selectedTask.id && handleUserChange(selectedTask.id, member.id, selectedTask.boardColumnId!)}
                          >
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage
                                src={`https://i.pravatar.cc/150?u=${member.firstName}`}
                                alt={member.firstName || ""}
                              />
                              <AvatarFallback>
                                {member.firstName?.[0] || ""}
                                {member.lastName?.[0] || ""}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {member.firstName} {member.lastName}
                            </span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Comments</h3>
                <span className="text-xs text-muted-foreground">
                  {selectedTask.comments?.length || 0} comment
                  {(selectedTask.comments?.length || 0) !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 mb-4">
                {selectedTask.comments?.map((comment: Comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    formatCommentTime={formatCommentTime}
                    onDelete={onDeleteComment}
                    canDeleteComment={canDeleteComment}
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <Button onClick={handleAddComment}>Post</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectedTaskCard;
