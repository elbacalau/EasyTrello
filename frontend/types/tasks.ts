import { AssignedUser } from "./userData";

export interface Task {
  id?: number;
  name?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: null;
  dueDate?: Date | null;
  status?: string | TaskStatus;
  priority?: string | TaskPriority;
  completed?: boolean;
  boardColumnId?: number;
  columnName?: string;
  boardId?: number;
  boardName?: string | null;
  assignedUserId?: number;
  assignedUser?: AssignedUser;
  labels?: string[];
  comments?: Comment[];
}


export interface Comment {
  id: number;
  comment: string;
  createdAt: Date;
  userId: number;
  userName: string;
}

export interface CreateComment {
  comment: string;
}


export interface CreateTaskRequest {
  name: string;
  description: string;
  dueDate?: Date | null;
  priority: TaskPriority;
  boardId: number;
  boardColumnId: number;
  assignedUserId: number;
  completed?: boolean;
  labels?: string[];
  comments?: Comment[];
}

export enum TaskStatus {
  ToDo = 1,
  InProgress = 2,
  Completed = 3,
}

export enum TaskPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
}
