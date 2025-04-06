"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Trello, CheckCircle2, Clock } from "lucide-react";
import { Board, BoardStats, UserData } from "@/types/userData";
import { useAppSelector } from "@/types/hooks";
import { RootState } from "@/store/store";
import { fetchTasksFromBoard } from "@/lib/api/tasks";
import { Task } from "@/types/tasks";
import { ApiResponse, ApiResponseTypes } from "@/types/apiResponse";
import { fetchBoards, fetchBoardStats } from "@/lib/api/board";

export default function BoardsPage() {
  const userData: UserData = useAppSelector((state: RootState) => state.user);

  const [boards, setBoards] = useState<Board[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskStats, setTaskStats] = useState<Record<number, { completed: number, pending: number }>>({});


  useEffect(() => {
    if (!userData.id) return;
    const loadBoardsAndStats = async () => {
      
      const boardsRes = await fetchBoards(userData.id!);
      const boardsFetched = boardsRes.detail;
      setBoards(boardsFetched);

      const stats: Record<number, { completed: number; pending: number }> = {};

      for (const board of boardsFetched) {
        const { result, detail }: ApiResponse<BoardStats> = await fetchBoardStats(board.id);
        if (result === ApiResponseTypes[ApiResponseTypes.success]) {
          stats[board.id] = {
            completed: detail.completedTasks,
            pending: detail.pendingTasks,
          };
        }
      }
      setTaskStats(stats);
    };

    loadBoardsAndStats();
  }, [userData.id]);


  const [newBoard, setNewBoard] = useState({
    name: "",
    description: "",
    color: "bg-blue-500",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredBoards = boards.filter(
    (board) =>
      board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBoard = () => {
    if (newBoard.name.trim() === "") return;

    setBoards(userData.boards);
    setNewBoard({
      name: "",
      description: "",
      color: "bg-blue-500",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Boards</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search boards..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Board
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Board</DialogTitle>
                <DialogDescription>
                  Add a new board to organize your tasks.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Board Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter board name"
                    value={newBoard.name}
                    onChange={(e) =>
                      setNewBoard({ ...newBoard, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter board description"
                    value={newBoard.description}
                    onChange={(e) =>
                      setNewBoard({ ...newBoard, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Board Color</Label>
                  <Select
                    value={newBoard.color}
                    onValueChange={(value) =>
                      setNewBoard({ ...newBoard, color: value })
                    }
                  >
                    <SelectTrigger id="color">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-blue-500">Blue</SelectItem>
                      <SelectItem value="bg-green-500">Green</SelectItem>
                      <SelectItem value="bg-purple-500">Purple</SelectItem>
                      <SelectItem value="bg-amber-500">Amber</SelectItem>
                      <SelectItem value="bg-red-500">Red</SelectItem>
                      <SelectItem value="bg-teal-500">Teal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateBoard}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>


      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBoards.map((board: Board) => (
          <Link key={board.id} href={`/dashboard/boards/${board.id}`}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-md">
              <div className={`h-2 w-full ${board.backgroundColor}`} />
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h3 className="font-semibold tracking-tight text-xl">
                    {board.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {board.description}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Trello className="mr-1 h-4 w-4" />
                  {/* TASK COUNT */}
                  {(() => {
                    const total =
                      (taskStats[board.id]?.completed ?? 0) + (taskStats[board.id]?.pending ?? 0);
                    return `${total} ${total === 1 ? "task" : "tasks"}`;
                  })()}

                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle2 className="mr-1 h-4 w-4" color="green" />
                    {/* COMPLETED TASK COUNT */}
                    {taskStats[board.id]?.completed || 0}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" color="grey"/>
                    {/* PENDING TASK */}
                    {taskStats[board.id]?.pending || 0}

                  </div>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
