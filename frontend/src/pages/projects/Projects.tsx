import { Board } from "../../api/interfaces/userData";
import ProjectCard from "../../components/ProjectCard";

const Projects = ({ boards }: { boards: Board[] }) => {
  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-5xl font-inter font-bold mb-20">Proyectos</h1>
        <div className="px-4 py-6 mt-12">
          <button
            type="button"
            className="flex ml-6 rounded-md bg-indigo-600 px-2 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => {}}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </span>{" "}
            Crear nuevo proyecto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {boards.map((board) => (
          <ProjectCard key={board.id} board={board} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
