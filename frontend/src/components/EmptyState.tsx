import { PlusIcon } from "@heroicons/react/20/solid";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="text-center py-10 px-6">
      <div className="mx-auto h-64 w-64 mb-6">
        <img
          src="/assets/illustration.png"
          alt="Empty State Illustration"
          className="h-full w-full object-contain"
        />
      </div>

      <h2 className="text-6xl font-bold text-gray-900 font-montserrat">{title}</h2>

      <p className="mt-2 text-md text-gray-500">{description}</p>

      <div className="mt-6">
        <button
          onClick={onAction}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
