import { Board } from "../../api/interfaces/userData";
import ProjectCard from "../../components/ProjectCard";

const Projects = ({ boards }: { boards: Board[] }) => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Proyectos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {boards.map((board) => (
          <ProjectCard key={board.id} board={board} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
