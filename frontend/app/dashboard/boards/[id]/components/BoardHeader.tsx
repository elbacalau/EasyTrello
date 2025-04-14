import React from "react";
import { Board } from "@/types/userData";
import { Button } from "@/components/ui/button";
import { User, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface BoardHeaderProps {
  currentBoard?: Board;
  isAdminOrOwner: () => boolean;
}

export default function BoardHeader({ currentBoard, isAdminOrOwner }: BoardHeaderProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {currentBoard?.name}
          </h1>
          <p className="text-muted-foreground">{currentBoard?.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdminOrOwner() ? (
            <Button variant="outline" size="sm">
              <User className="mr-2 h-4 w-4" />
              Invite
            </Button>
          ) : null}

          {isAdminOrOwner() ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Board</DropdownMenuItem>
                <DropdownMenuItem>Board Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete Board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      <Breadcrumb
        segments={[
          { name: "Dashboard", href: "/dashboard" },
          { name: "Boards", href: "/dashboard/boards" },
          {
            name: currentBoard?.name || "",
            href: `/dashboard/boards/${currentBoard?.id}`,
            current: true,
          },
        ]}
      />
    </>
  );
} 