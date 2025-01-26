import { LayoutProps } from "../api/interfaces/userData";
import EmptyState from "../components/EmptyState";

export const Dashboard = ({ user }: LayoutProps) => {
  
  const hasBoards = (user?.boards ?? []).length > 0;

  return (
    <div>
      {!hasBoards ? (
        <div>
          <h2>Boards</h2>
          <ul>
            {user?.boards?.map((board) => (
              <li key={board.id}>{board.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState
          title={"Bienvenido a tu dashboard"}
          description={"Crea tu primer tablero para empezar a organizar tus tareas."}
          actionLabel={"Crear tablero"}
          onAction={function (): void {
            alert("Crear tablero");
          }}
        />
      )}
    </div>
  );
};
