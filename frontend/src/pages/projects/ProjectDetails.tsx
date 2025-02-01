import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AssignedUser,
  Board,
  BoardColumn,
  UserData,
} from "../../api/interfaces/userData";
import { BoardColumnComponent } from "../../components/BoardColumn";
import { getTaskFromBoard } from "../../api/services/board/boardService";
import { TaskInterface } from "../../api/interfaces/task";
import { capitalize } from "../../utils/helpers";
import { BoardRole } from "../../api/interfaces/board";

export const ProjectDetails = ({ user }: { user: UserData }) => {
  const { boardId } = useParams();
  const [board, setBoard] = useState<Board | undefined>(undefined);
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [allColumns, setAllColumns] = useState<BoardColumn[]>([]);
  const [userRole, setUserRole] = useState<boolean>(false);

  useEffect(() => {
    const selectedBoard = user.boards?.find((b) => b.id === Number(boardId));
    setBoard(selectedBoard);
    setAllColumns(selectedBoard?.boardColumns ?? []);
    setTasks([]);

    const fetchTasks = async () => {
      try {
        const tasksResponse: TaskInterface[] = await getTaskFromBoard(
          Number(boardId)
        );
        setTasks(tasksResponse);
      } catch (error) {
        console.error("Error cargando tareas:", error);
      }
    };

    fetchTasks();
  }, [boardId, user.boards, user.email]);

  useEffect(() => {
    if (!board) return;

    const userEmail: AssignedUser | undefined = board?.assignedUsers?.find(
      (au) => au.email === user.email
    );


    if (
      userEmail?.role &&
      (BoardRole[userEmail.role as unknown as keyof typeof BoardRole] ===
        BoardRole.Owner || 
        BoardRole[userEmail.role as unknown as keyof typeof BoardRole] === BoardRole.Admin)
    ) {
      setUserRole(true);
    } else {
      setUserRole(false);
    }
  }, [board, user.email]);

  useEffect(() => {
  }, [userRole]);


  
  return (
    <div key={boardId} className="flex flex-col h-full ">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          {capitalize(board?.name ?? "Tablero")}
        </h1>
      </div>

      <div className="flex gap-6 overflow-x-auto">
        {allColumns.length > 0 ? (
          allColumns.map((col) => (
            <BoardColumnComponent
              key={col.id}
              column={col}
              tasks={tasks}
              isEditingEnabled={userRole}
            />
          ))
        ) : (
          <p className="text-gray-500">No hay columnas disponibles.</p>
        )}
      </div>
    </div>
  );
};
