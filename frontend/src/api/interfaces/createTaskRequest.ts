export interface CreateTaskRequest {
  name: string;
  description: string;
  dueDate: Date;
  status: string;
  priority: string;
  boardId: number;          
  assignedUserId: number;   
  completed: boolean;
  labels: string[];
}
