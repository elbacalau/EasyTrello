export interface TaskInterface {
  id?:               number;
  name?:             string;
  description?:      string;
  createdAt?:        Date;
  updatedAt?:        null;
  dueDate?:          Date;
  status?:           string;
  priority?:         string;
  completed?:        boolean;
  boardId?:          number;
  boardName?:        null;
  assignedUserId?:   number;
  assignedUserName?: null;
  labels?:           string[];
  comments?:         TaskComment[];
}

export interface TaskComment {
  id?:        number;
  comment?:   string;
  createdAt?: Date;
  userId?:    number;
  userName?:  string;
}
