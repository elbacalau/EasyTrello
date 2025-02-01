import { TrashIcon } from "@heroicons/react/24/outline";
import { TaskComment } from "../api/interfaces/task";

interface CommentsProps {
  comments: TaskComment[];
  onDelete: (id: number) => void;
}

export default function CommentsComponent({ comments, onDelete }: CommentsProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">Comentarios</label>
      <div className="mt-2 space-y-2 max-h-40 overflow-auto">
        {comments.length > 0 ? (
          comments.map((comment: TaskComment) => (
            <div
              key={comment.id}
              className="p-2 border rounded-md flex items-start justify-between"
            >
              <div>
                <p className="text-sm font-semibold">{comment.userName}</p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.createdAt!).toLocaleString()}
                </p>
                <p className="text-sm">{comment.comment}</p>
              </div>

              <button onClick={() => onDelete(comment.id!)} className="ml-4">
                <TrashIcon className="size-5 text-red-500 hover:text-red-900 transition" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No hay comentarios.</p>
        )}
      </div>
    </div>
  );
}
