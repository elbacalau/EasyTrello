import React, { useState } from "react";
import { BoardColumn } from "../api/interfaces/userData";
import { TaskInterface } from "../api/interfaces/task";
import { returnTaskTextLength } from "../utils/helpers";
import {
  Cog8ToothIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import TaskInfo from "./TaskInfo";
import { AssignedUser } from "../api/interfaces/board";
import AddNewTask from "./AddNewTask";

interface BoardColumnProps {
  column: BoardColumn;
  tasks: TaskInterface[];
  isEditingEnabled: boolean;
  assignedUsers: AssignedUser[];
}

export const BoardColumnComponent: React.FC<BoardColumnProps> = ({
  column,
  tasks = [],
  isEditingEnabled,
  assignedUsers,
}) => {
  const [selectedTask, setSelectedTask] = useState<TaskInterface | null>(null);
  const [addTaskOpen, setAddTaskOpen] = useState<boolean>(false);

  const handleOpenModalAddTask = () => {
    setAddTaskOpen(true);
  }

  return (
    <div className="w-72 bg-gray-200 shadow-xl rounded-lg p-4 border-t-4 border-blue-500 h-auto font-inter">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          {column.columnName?.toUpperCase()}
        </h2>
        <span className="text-gray-600 text-sm font-medium font-inter">
          {returnTaskTextLength(tasks)}
        </span>
        <span>
          <button>
            <Cog8ToothIcon className="size-6 text-black hover:text-gray-700 duration-200 ease-in mt-1" />
          </button>
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-100 p-3 rounded-md shadow-sm flex justify-between items-center "
            >
              <p className="text-gray-800 font-medium text-sm">{task.name}</p>
              <button onClick={() => setSelectedTask(task)}>
                <EllipsisHorizontalIcon className="w-5 h-5 text-black hover:text-gray-800 cursor-pointer" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No hay tareas.</p>
        )}
      </div>

      <button className="mt-4 w-full py-2 flex rounded-md bg-indigo-600 px-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={handleOpenModalAddTask}>
        + Agregar tarea
      </button>

      {selectedTask && (
        <TaskInfo
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          editingEnabled={isEditingEnabled}
          assignedUsers={assignedUsers}
        />
      )}


      {addTaskOpen && (
        <AddNewTask onClose={() => setAddTaskOpen(false)}/>
      )}
    </div>
  );
};
