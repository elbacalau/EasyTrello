import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Tag, Trash2 } from "lucide-react";
import { Task, Comment } from "@/types/tasks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface SelectedTaskCardProps {
  selectedTask: Task;
  newComment: string;
  columnId: number
  setNewComment: (comment: string) => void;
  handleAddComment: () => void;
  formatDate: (dateString: string | Date | null) => string;
  formatCommentTime: (timestamp: string | Date | null) => string;
  getPriorityColor: (priority: number) => string;
  handleDeleteTask: (taskId: number, columnId: number) => void
}

const SelectedTaskCard: React.FC<SelectedTaskCardProps> = ({
  selectedTask,
  newComment,
  setNewComment,
  handleAddComment,
  formatDate,
  formatCommentTime,
  getPriorityColor,
  handleDeleteTask,
  columnId,
}) => {
  return (
    <div className="w-[calc(50%-16rem)] h-fit">
      <Card className="h-full">
        <CardHeader>
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
        <CardContent className="overflow-y-auto max-h-[calc(100vh-300px)]">
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
              <div className="flex items-center gap-2">
                {selectedTask.assignedUser ? (
                  <>
                    <Avatar className="h-8 w-8">
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
              <div className="space-y-4">
                {selectedTask.comments?.map((comment: Comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://i.pravatar.cc/150?u=${comment.userName}`}
                        alt={comment.userName}
                      />
                      <AvatarFallback>
                        {comment.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatCommentTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                    </div>
                  </div>
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
