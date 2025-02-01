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
  role?: string;
}

export interface BoardColumn {
  id?: number;
  columnName?: string;
}

export enum BoardRole {
  Owner = 1,
  Admin = 2,
  User = 3,
  Viewer = 4,
}
