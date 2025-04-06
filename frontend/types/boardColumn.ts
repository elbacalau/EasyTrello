import { Task } from "./tasks";

export interface BoardColumn {
    id?:         number;
    columnName?: string;
    boardId?:    number;
    tasks?:      Task[];
}