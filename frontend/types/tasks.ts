import { AssignedUser } from "./userData";

export interface Task {
  id:               number;
  name:             string;
  description:      string;
  createdAt:        Date;
  updatedAt:        null;
  dueDate:          Date;
  status:           string;
  priority:         string;
  completed:        boolean;
  boardId:          number;
  boardName:        null;
  assignedUserId:   number;
  assignedUser: AssignedUser;
  labels:           string[];
  comments:         Comment[];
}

export interface Comment {
  id:        number;
  comment:   string;
  createdAt: Date;
  userId:    number;
  userName:  string;
}
