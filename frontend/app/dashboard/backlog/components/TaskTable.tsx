import React from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProcessedTask } from "../hooks/useTasks";
import { getPriorityColor, getStatusColor } from "@/lib/backlogFunctions";
import { formatDate } from "@/lib/formatters";
interface TaskTableProps {
  tasks: ProcessedTask[];
  sortColumn: string;
  sortDirection: "asc" | "desc";
  handleSort: (column: string) => void;
}

export function TaskTable({
  tasks,
  sortColumn,
  sortDirection,
  handleSort,
}: TaskTableProps) {
  return (
    <div className="overflow-x-auto max-h-[calc(100vh-400px)] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                Tarea
                {sortColumn === "name" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("board")}
            >
              <div className="flex items-center">
                Tablero
                {sortColumn === "board" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center">
                Estado
                {sortColumn === "status" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("priority")}
            >
              <div className="flex items-center">
                Prioridad
                {sortColumn === "priority" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("dueDate")}
            >
              <div className="flex items-center">
                Fecha límite
                {sortColumn === "dueDate" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </span>
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("assignee")}
            >
              <div className="flex items-center">
                Asignado a
                {sortColumn === "assignee" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </span>
                )}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Link
                    href={`/dashboard/boards/${task.boardId}?task=${task.id}`}
                    className="font-medium hover:underline"
                  >
                    {task.name}
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {task.description}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2 bg-blue-500"></div>
                    <span>{task.boardName || "Sin tablero"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(task.status)} text-white`}
                  >
                    {task.statusName}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getPriorityColor(task.priority)}
                  >
                    {task.priorityName}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {formatDate(task.dueDate)}
                  </div>
                </TableCell>
                <TableCell>
                  {task.assignedUser && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${task.assignedUser.firstName}+${task.assignedUser.lastName}&background=random`}
                          alt={`${task.assignedUser.firstName} ${task.assignedUser.lastName}`}
                        />
                        <AvatarFallback>
                          {task.assignedUser.firstName[0]}
                          {task.assignedUser.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>{task.assigneeName}</span>
                    </div>
                  )}
                  {!task.assignedUser && (
                    <span className="text-muted-foreground">Sin asignar</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <p>No se encontraron tareas</p>
                  <p className="text-sm">Intenta ajustar tus filtros</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
