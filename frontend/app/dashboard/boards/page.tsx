"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Trello, CheckCircle2, Clock } from "lucide-react"

// Sample board data
const initialBoards = [
  {
    id: 1,
    name: "Marketing Campaign",
    description: "Q2 marketing campaign planning and execution",
    color: "bg-blue-500",
    tasks: 12,
    completed: 5,
  },
  {
    id: 2,
    name: "Product Launch",
    description: "New product launch timeline and tasks",
    color: "bg-green-500",
    tasks: 8,
    completed: 3,
  },
  {
    id: 3,
    name: "Website Redesign",
    description: "Redesign company website for better UX",
    color: "bg-purple-500",
    tasks: 15,
    completed: 10,
  },
  {
    id: 4,
    name: "Customer Feedback",
    description: "Collect and analyze customer feedback",
    color: "bg-amber-500",
    tasks: 6,
    completed: 2,
  },
  {
    id: 5,
    name: "Quarterly Goals",
    description: "Track progress on quarterly objectives",
    color: "bg-red-500",
    tasks: 9,
    completed: 4,
  },
  {
    id: 6,
    name: "Team Onboarding",
    description: "Onboarding process for new team members",
    color: "bg-teal-500",
    tasks: 7,
    completed: 6,
  },
]

export default function BoardsPage() {
  const [boards, setBoards] = useState(initialBoards)
  const [searchQuery, setSearchQuery] = useState("")
  const [newBoard, setNewBoard] = useState({
    name: "",
    description: "",
    color: "bg-blue-500",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredBoards = boards.filter(
    (board) =>
      board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateBoard = () => {
    if (newBoard.name.trim() === "") return

    const newBoardWithId = {
      ...newBoard,
      id: boards.length + 1,
      tasks: 0,
      completed: 0,
    }

    setBoards([...boards, newBoardWithId])
    setNewBoard({
      name: "",
      description: "",
      color: "bg-blue-500",
    })
    setIsDialogOpen(false)
  }

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
                <DialogDescription>Add a new board to organize your tasks.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Board Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter board name"
                    value={newBoard.name}
                    onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter board description"
                    value={newBoard.description}
                    onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Board Color</Label>
                  <Select value={newBoard.color} onValueChange={(value) => setNewBoard({ ...newBoard, color: value })}>
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
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateBoard}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBoards.map((board) => (
          <Link key={board.id} href={`/dashboard/boards/${board.id}`}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-md">
              <div className={`h-2 w-full ${board.color}`} />
              <CardContent className="p-6">
                <div className="space-y-2">
                  <h3 className="font-semibold tracking-tight text-xl">{board.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{board.description}</p>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Trello className="mr-1 h-4 w-4" />
                  {board.tasks} tasks
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    {board.completed}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {board.tasks - board.completed}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

