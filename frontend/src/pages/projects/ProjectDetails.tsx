import { useParams } from "react-router-dom";
import { Board, BoardColumn, UserData } from "../../api/interfaces/userData";
import { BoardColumnComponent } from "../../components/BoardColumn";
import { useEffect, useState } from "react";
import { getTaskFromBoard } from "../../api/services/board/boardService";
import { TaskInterface } from "../../api/interfaces/task";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

export const ProjectDetails = ({ user }: { user: UserData }) => {
  const { boardId } = useParams();
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const board: Board | undefined = user.boards?.find(
    (b) => b.id === Number(boardId)
  );
  const [allColumns, setAllColumns] = useState<BoardColumn[]>(
    board?.boardColumns ?? []
  );

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksResponse: TaskInterface[] = await getTaskFromBoard(
          Number(boardId)
        );
        if (tasksResponse.length !== 0) setTasks(tasksResponse);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTasks();
  }, [boardId]);

  const colors = [
    "border-cyan-500",
    "border-red-500",
    "border-green-500",
    "border-yellow-500",
    "border-blue-500",
  ];
  const shuffledColors = [...colors].sort(() => Math.random() - 0.5);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = allColumns.find(
      (col) => col.id!.toString() === source.droppableId
    );
    const destColumn = allColumns.find(
      (col) => col.id!.toString() === destination.droppableId
    );

    if (!sourceColumn || !destColumn) return;

    const sourceTasks = [...(sourceColumn.tasks || [])];
    const destTasks = [...(destColumn.tasks || [])];

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, movedTask);

    const updatedColumns = allColumns.map((col) => {
      if (col.id === sourceColumn.id) return { ...col, tasks: sourceTasks };
      if (col.id === destColumn.id) return { ...col, tasks: destTasks };
      return col;
    });

    setAllColumns(updatedColumns);
  };

  return (
    <div key={board?.id} className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-5xl font-bold font-inter">Tablero</h1>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="h-full w-full flex gap-2 md:gap-8 sm:gap-5 py-4 overflow-x-auto">
          {allColumns.map((col, index) => {
            const colorClass = shuffledColors[index % shuffledColors.length];
            return (
              <BoardColumnComponent
                key={col.id}
                column={col}
                tasks={tasks.filter((task) => task.boardId === col.id)}
                color={colorClass}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};
