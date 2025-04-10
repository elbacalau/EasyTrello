import { BoardColumn } from "./boardColumn";

export interface UserData {
  id: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl: string | null;
  dateCreated: string | null; 
  dateModified: string | null;
  isActive: boolean;
  boards: Board[];
}

export interface Board {
  id: number;
  name: string;
  description: string;
  status: string;
  visibility: string;
  createdAt: string | null; 
  updatedAt: string | null;
  assignedUsers: AssignedUser[];
  boardColumns: BoardColumn[];
  backgroundColor: string;
}

export interface AssignedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
}


export interface BoardStats {
  pendingTasks: number;
  completedTasks: number;
}
