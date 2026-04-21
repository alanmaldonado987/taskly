"use client";

import { useProjectStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  X,
  ChevronDown,
  ArrowUp,
  Clock,
  Users,
  Link2,
  MessageSquare,
  Paperclip,
  Trash2,
  Copy,
  Diamond,
} from "lucide-react";
import { useState, useEffect } from "react";

const STATUSES = ["open", "in-progress", "done", "closed"];
const PRIORITIES = ["highest", "high", "medium", "low", "lowest"];

const STATUS_LABELS = {
  open: "Abierto",
  "in-progress": "En Progreso",
  done: "Terminado",
  closed: "Cerrado",
};

const PRIORITY_LABELS = {
  highest: "Más alta",
  high: "Alta",
  medium: "Media",
  low: "Baja",
  lowest: "Más baja",
};

const PRIORITY_COLORS = {
  highest: "text-red-600",
  high: "text-orange-500",
  medium: "text-gray-500",
  low: "text-blue-500",
  lowest: "text-gray-400",
};

const TASK_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
];

export function TaskModal() {
  const {
    project,
    selectedTaskId,
    isTaskModalOpen,
    setTaskModalOpen,
    setSelectedTask,
    updateTask,
    deleteTask,
  } = useProjectStore();

  const task = selectedTaskId ? project.tasks.find((t) => t.id === selectedTaskId) : null;

  const [editedTask, setEditedTask] = useState({});

  useEffect(() => {
    if (task) {
      setEditedTask({
        name: task.name,
        description: task.description,
        startDate: task.startDate,
        endDate: task.endDate,
        progress: task.progress,
        status: task.status,
        priority: task.priority,
        assignees: task.assignees,
        estimatedHours: task.estimatedHours,
        loggedHours: task.loggedHours,
        color: task.color,
      });
    }
  }, [task]);

  const handleClose = () => {
    setTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleSave = () => {
    if (task && editedTask) {
      updateTask(task.id, editedTask);
    }
  };

  const handleDelete = () => {
    if (task) {
      deleteTask(task.id);
      handleClose();
    }
  };

  const getMemberById = (id) => project.members.find((m) => m.id === id);

  if (!task) return null;

  return (
    <Dialog open={isTaskModalOpen} onOpenChange={setTaskModalOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {task.isMilestone ? (
                <Diamond className="w-5 h-5 text-primary" />
              ) : (
                <div
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ backgroundColor: editedTask.color || task.color }}
                />
              )}
              <DialogTitle className="text-xl">{task.name}</DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(task.id)}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="comments">Comentarios</TabsTrigger>
              <TabsTrigger value="attachments">Archivos</TabsTrigger>
              <TabsTrigger value="activity">Actividad</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="space-y-2">
                <Label>Nombre de tarea</Label>
                <Input
                  value={editedTask.name || ""}
                  onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Descripcion</Label>
                <Textarea
                  value={editedTask.description || ""}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  placeholder="Agregar una descripcion..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de inicio</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {editedTask.startDate
                          ? format(editedTask.startDate, "MMM d, yyyy")
                          : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editedTask.startDate}
                        onSelect={(date) =>
                          date && setEditedTask({ ...editedTask, startDate: date })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Fecha de fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {editedTask.endDate
                          ? format(editedTask.endDate, "MMM d, yyyy")
                          : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editedTask.endDate}
                        onSelect={(date) =>
                          date && setEditedTask({ ...editedTask, endDate: date })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "font-normal",
                            editedTask.status === "done" && "bg-green-100 text-green-700",
                            editedTask.status === "in-progress" && "bg-blue-100 text-blue-700",
                            editedTask.status === "open" && "bg-gray-100 text-gray-700"
                          )}
                        >
                          {STATUS_LABELS[editedTask.status || task.status]}
                        </Badge>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      {STATUSES.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => setEditedTask({ ...editedTask, status })}
                        >
                          <Badge
                            variant="secondary"
                            className={cn(
                              "font-normal",
                              status === "done" && "bg-green-100 text-green-700",
                              status === "in-progress" && "bg-blue-100 text-blue-700",
                              status === "open" && "bg-gray-100 text-gray-700"
                            )}
                          >
                            {STATUS_LABELS[status]}
                          </Badge>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-2">
                  <Label>Prioridad</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <div
                          className={cn(
                            "flex items-center gap-1",
                            PRIORITY_COLORS[editedTask.priority || task.priority]
                          )}
                        >
                          <ArrowUp className="w-4 h-4" />
                          {PRIORITY_LABELS[editedTask.priority || task.priority]}
                        </div>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      {PRIORITIES.map((priority) => (
                        <DropdownMenuItem
                          key={priority}
                          onClick={() => setEditedTask({ ...editedTask, priority })}
                        >
                          <div className={cn("flex items-center gap-1", PRIORITY_COLORS[priority])}>
                            <ArrowUp className="w-4 h-4" />
                            {PRIORITY_LABELS[priority]}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Progreso</Label>
                  <span className="text-sm text-muted-foreground">
                    {editedTask.progress || 0}%
                  </span>
                </div>
                <Slider
                  value={[editedTask.progress || 0]}
                  max={100}
                  step={5}
                  onValueChange={([value]) => setEditedTask({ ...editedTask, progress: value })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Asignados</Label>
                <div className="flex flex-wrap gap-2">
                  {(editedTask.assignees || []).map((assigneeId) => {
                    const member = getMemberById(assigneeId);
                    if (!member) return null;
                    return (
                      <Badge
                        key={assigneeId}
                        variant="secondary"
                        className="gap-1 pr-1 py-1"
                      >
                        <Avatar className="w-5 h-5">
                          <AvatarFallback
                            className="text-[10px]"
                            style={{ backgroundColor: member.color, color: "white" }}
                          >
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {member.name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-4 h-4 ml-1"
                          onClick={() =>
                            setEditedTask({
                              ...editedTask,
                              assignees: (editedTask.assignees || []).filter(
                                (id) => id !== assigneeId
                              ),
                            })
                          }
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Users className="w-4 h-4" />
                        Agregar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {project.members
                        .filter((m) => !(editedTask.assignees || []).includes(m.id))
                        .map((member) => (
                          <DropdownMenuItem
                            key={member.id}
                            onClick={() =>
                              setEditedTask({
                                ...editedTask,
                                assignees: [...(editedTask.assignees || []), member.id],
                              })
                            }
                          >
                            <Avatar className="w-5 h-5 mr-2">
                              <AvatarFallback
                                className="text-[10px]"
                                style={{ backgroundColor: member.color, color: "white" }}
                              >
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {member.name}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Horas estimadas</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={editedTask.estimatedHours || ""}
                      onChange={(e) =>
                        setEditedTask({
                          ...editedTask,
                          estimatedHours: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="pl-9"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Horas registradas</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={editedTask.loggedHours || ""}
                      onChange={(e) =>
                        setEditedTask({
                          ...editedTask,
                          loggedHours: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="pl-9"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color de tarea</Label>
                <div className="flex gap-2">
                  {TASK_COLORS.map((color) => (
                    <button
                      key={color}
                      className={cn(
                        "w-8 h-8 rounded-lg transition-transform hover:scale-110",
                        editedTask.color === color && "ring-2 ring-primary ring-offset-2"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setEditedTask({ ...editedTask, color })}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    JD
                  </AvatarFallback>
                </Avatar>
                <Input placeholder="Agregar un comentario..." className="flex-1" />
                <Button size="sm">Enviar</Button>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Sin comentarios</p>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4">
              <Button variant="outline" className="w-full gap-2">
                <Paperclip className="w-4 h-4" />
                Agregar archivo
              </Button>
              <div className="text-center py-8 text-muted-foreground">
                <Paperclip className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Sin archivos</p>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Sin actividad</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-shrink-0 pt-4 border-t border-border flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar cambios</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}