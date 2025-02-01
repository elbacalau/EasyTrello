export interface Board {
  id?: number;
  name?: string;
  description?: string;
  status?: string;
  visibility?: string;
  createdAt?: Date;
  updatedAt?: Date;
  assignedUsers?: AssignedUser[];
  boardColumns?: BoardColumn[];
  backgroundColor?: string;
}

export interface AssignedUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: BoardRole;
}

export interface BoardColumn {
  id?: number;
  columnName?: string;
}

export type BoardRole = "Owner" | "Admin" | "User" | "Viewer";
