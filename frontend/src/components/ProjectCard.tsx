import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { Board } from "../api/interfaces/userData";
import { Link } from "react-router-dom";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const statuses: Record<"To-Do" | "In-Progress" | "Done", string> = {
  "To-Do": "text-green-700 bg-green-50 ring-green-600/20",
  "In-Progress": "text-gray-600 bg-gray-50 ring-gray-500/10",
  Done: "text-red-700 bg-red-50 ring-red-600/10",
};

export default function ProjectCard({ board }: { board: Board }) {
  const updatedAt = board.updatedAt ? new Date(board.updatedAt) : null;

  return (
    <li className="list-none overflow-hidden rounded-xl border border-gray-200 max-w-lg">
      {/* Header */}
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
        <div className="h-12 w-12 flex-none rounded-lg bg-white ring-1 ring-gray-900/10 flex items-center justify-center text-xl font-medium">
          {board.name?.charAt(0).toUpperCase() || ""}
        </div>
        <div className="text-sm font-medium text-gray-900">{board.name}</div>

        {/* Menu */}
        <Menu as="div" className="relative ml-auto">
          <MenuButton className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
            <span className="sr-only">Open options</span>
            <EllipsisHorizontalIcon aria-hidden="true" className="h-5 w-5" />
          </MenuButton>
          <MenuItems
            transition
            className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
          >
            <MenuItem>
              <Link
                to={`/projects/${board.id}`}
                className="block px-3 py-1 text-sm text-gray-900 hover:bg-gray-50"
              >
                View<span className="sr-only">, {board.name}</span>
              </Link>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>

      {/* Details Section */}
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm">
        {/* Status */}
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Status</dt>
          <dd className="flex items-start gap-x-2">
            <div
              className={classNames(
                statuses[board.status as keyof typeof statuses] ||
                  "text-gray-700 bg-gray-50 ring-gray-500/10",
                "rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
              )}
            >
              {board.status?.charAt(0).toUpperCase() + board.status?.slice(1) ||
                "Unknown"}
            </div>
          </dd>
        </div>

        {/* Last Updated */}
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Last Updated</dt>
          <dd className="text-gray-700">
            {updatedAt ? (
              <time dateTime={updatedAt.toISOString()}>
                {updatedAt.toLocaleDateString()}
              </time>
            ) : (
              "N/A"
            )}
          </dd>
        </div>

        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Usuarios</dt>
          <dd className="text-gray-700"> {board.assignedUsers?.length}</dd>
        </div>
      </dl>
    </li>
  );
}
