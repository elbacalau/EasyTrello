import React from "react";
import { BoardColumn } from "@/types/boardColumn";
import { AssignedUser } from "@/types/userData";
import { CreateTaskRequest, TaskPriority } from "@/types/tasks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newTask: CreateTaskRequest;
  setNewTask: (task: CreateTaskRequest) => void;
  selectedColumnId: number | null;
  filteredColumns: BoardColumn[];
  teamMembers: AssignedUser[];
  handleAddTask: (columnId: number) => void;
}

export default function NewTaskDialog({
  isOpen,
  onOpenChange,
  newTask,
  setNewTask,
  selectedColumnId,
  filteredColumns,
  teamMembers,
  handleAddTask,
}: NewTaskDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task for the{" "}
            {
              filteredColumns.find((col) => col.id === selectedColumnId)
                ?.columnName
            }{" "}
            column.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={newTask.name}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <div className="flex gap-2">
              <Input
                id="dueDate"
                type="date"
                value={
                  newTask.dueDate
                    ? new Date(newTask.dueDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    dueDate: e.target.value ? new Date(e.target.value) : null,
                  })
                }
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const today = new Date();
                  setNewTask({
                    ...newTask,
                    dueDate: today,
                  });
                }}
              >
                Hoy
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={newTask.priority.toString()}
              onValueChange={(value) =>
                setNewTask({
                  ...newTask,
                  priority: parseInt(value) as TaskPriority,
                })
              }
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TaskPriority.Low.toString()}>
                  Low
                </SelectItem>
                <SelectItem value={TaskPriority.Medium.toString()}>
                  Medium
                </SelectItem>
                <SelectItem value={TaskPriority.High.toString()}>
                  High
                </SelectItem>
                <SelectItem value={TaskPriority.Critical.toString()}>
                  Critical
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select
              onValueChange={(value) => {
                const assignee = teamMembers.find(
                  (member) => member.id.toString() === value
                );
                setNewTask({ ...newTask, assignedUserId: assignee?.id! });
              }}
            >
              <SelectTrigger id="assignee">
                <SelectValue placeholder="Assign to..." />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.firstName} {member.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              selectedColumnId && handleAddTask(selectedColumnId)
            }
          >
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 