import React from "react";
import { BoardColumn } from "../api/interfaces/userData";
import { TaskInterface } from "../api/interfaces/task";
import { Droppable, Draggable } from "@hello-pangea/dnd";

interface BoardColumnProps {
  column: BoardColumn;
  tasks: TaskInterface[];
  color: string; // 🔥 Recibe el color
}

export const BoardColumnComponent: React.FC<BoardColumnProps> = ({ column, tasks, color }) => {
  return (
    <Droppable droppableId={column.id!.toString()} type="TASK">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className={`w-80 bg-slate-100 h-fit px-4 py-2 flex flex-col rounded-md shadow-lg border-t-2 ${color}`}>
          {/* Header de la columna */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-poppins text-gray-600 font-bold text-xl">{column.columnName?.toUpperCase()}</h2>
            <span className="text-gray-600 text-xl font-medium ml-2">{tasks.length}</span>
          </div>

          <div className="flex flex-col gap-2">
            {tasks.map((task, index) => (
              <Draggable key={task.id!.toString()} draggableId={task.id!.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white p-3 rounded-md shadow cursor-pointer"
                  >
                    <p className="text-gray-700 font-semibold">{task.name}</p>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>

          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600">
            + Agregar tarea
          </button>
        </div>
      )}
    </Droppable>
  );
};
