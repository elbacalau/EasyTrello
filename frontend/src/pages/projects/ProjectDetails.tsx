import { useParams } from "react-router-dom";
import { UserData } from "../../api/interfaces/userData";

export const ProjectDetails = ({ user }: { user: UserData }) => {
  const { boardId } = useParams();
  
  
  const board = user.boards?.find((b) => b.id === Number(boardId))
  
  
  if (!board) {
    return <div>No se encontro el proyecto.</div>
  }

  return (
    <div>
      <h1>test</h1>
      <p>{ user.email }</p>
      <p>{ board.status }</p>
    </div>
  );
};
