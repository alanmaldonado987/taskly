"use client";

import { useProjectStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Plus,
  Filter,
  ChevronDown,
  Calendar,
  ArrowUp,
  MessageSquare,
  Paperclip,
  Diamond,
} from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const STATUSES = ["open", "in-progress", "done", "closed"];

const STATUS_CONFIG = {
  open: { label: "ABIERTO", color: "text-gray-700", bgColor: "bg-gray-100" },
  "in-progress": { label: "EN PROGRESO", color: "text-yellow-700", bgColor: "bg-yellow-50" },
  done: { label: "TERMINADO", color: "text-green-700", bgColor: "bg-green-50" },
  closed: { label: "CERRADO", color: "text-red-700", bgColor: "bg-red-50" },
};

const PRIORITY_COLORS = {
  highest: "text-red-600",
  high: "text-orange-500",
  medium: "text-gray-500",
  low: "text-blue-500",
  lowest: "text-gray-400",
};

const PRIORITY_LABELS = {
  highest: "Highest",
  high: "High",
  medium: "Medium",
  low: "Low",
  lowest: "Lowest",
};

function TaskCard({ task, onClick }) {
  const { project } = useProjectStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getMemberById = (id) => project.members.find((m) => m.id === id);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow border-l-4",
        isDragging && "opacity-50 shadow-lg"
      )}
      {...attributes}
      {...listeners}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {task.isMilestone ? (
              <Diamond className="w-4 h-4 text-primary flex-shrink-0" />
            ) : (
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: task.color }}
              />
            )}
            <span className="font-medium text-sm truncate">{task.name}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="w-6 h-6 flex-shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Editar tarea</DropdownMenuItem>
              <DropdownMenuItem>Duplicar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>
            {format(task.startDate, "MMM d")} - {format(task.endDate, "MMM d")}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {task.priority !== "medium" && (
              <div className={cn("flex items-center gap-0.5", PRIORITY_COLORS[task.priority])}>
                <ArrowUp className="w-3 h-3" />
                <span className="text-xs">{PRIORITY_LABELS[task.priority]}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {task.assignees.length > 0 && (
              <div className="flex -space-x-1">
                {task.assignees.slice(0, 2).map((assigneeId) => {
                  const member = getMemberById(assigneeId);
                  if (!member) return null;
                  return (
                    <Avatar key={assigneeId} className="w-6 h-6 border-2 border-background">
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
                  );
                })}
                {task.assignees.length > 2 && (
                  <Avatar className="w-6 h-6 border-2 border-background">
                    <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                      +{task.assignees.length - 2}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            )}
          </div>
        </div>

        {task.progress > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <Progress value={task.progress} className="h-1.5 flex-1" />
            <span className="text-xs text-muted-foreground">{task.progress}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Column({ status, tasks, onTaskClick }) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex-1 min-w-[280px] max-w-[350px] flex flex-col">
      <div className={cn("rounded-t-lg px-3 py-2", config.bgColor)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("font-medium text-sm", config.color)}>{config.label}</span>
            <Badge variant="secondary" className="h-5 text-xs">
              {tasks.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="w-6 h-6">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-muted/30 p-2 space-y-2 overflow-y-auto rounded-b-lg border border-t-0 border-border">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
          ))}
        </SortableContext>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground h-9"
        >
          <Plus className="w-4 h-4" />
          Añadir tarea
        </Button>
      </div>
    </div>
  );
}

export function BoardView() {
  const { project, setSelectedTask, setTaskModalOpen, moveTask } = useProjectStore();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tasksByStatus = useMemo(() => {
    const grouped = {
      open: [],
      "in-progress": [],
      done: [],
      closed: [],
    };
    project.tasks.forEach((task) => {
      grouped[task.status].push(task);
    });
    return grouped;
  }, [project.tasks]);

  const activeTask = activeId ? project.tasks.find((t) => t.id === activeId) : null;

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTask = project.tasks.find((t) => t.id === active.id);
    const overTask = project.tasks.find((t) => t.id === over.id);

    if (activeTask && overTask && activeTask.status !== overTask.status) {
      moveTask(activeTask.id, overTask.status);
    }

    setActiveId(null);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = project.tasks.find((t) => t.id === active.id);

    if (STATUSES.includes(over.id)) {
      if (activeTask && activeTask.status !== over.id) {
        moveTask(activeTask.id, over.id);
      }
    }
  };

  const handleTaskClick = (taskId) => {
    setSelectedTask(taskId);
    setTaskModalOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col overflow-hidden bg-card">
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/30">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                Agrupar por: <span className="font-medium">Estado</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Estado</DropdownMenuItem>
              <DropdownMenuItem>Prioridad</DropdownMenuItem>
              <DropdownMenuItem>Asignado</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                Ordenar por: <span className="font-medium">Fecha de creacion</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Fecha de creacion</DropdownMenuItem>
              <DropdownMenuItem>Fecha de inicio</DropdownMenuItem>
              <DropdownMenuItem>Prioridad</DropdownMenuItem>
              <DropdownMenuItem>Nombre</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-xs text-muted-foreground">¿Falta algo?</span>

          <div className="ml-auto">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <Filter className="w-3 h-3" />
              Filtro
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            <div className="flex gap-4 h-full min-w-max">
              {STATUSES.map((status) => (
                <Column
                  key={status}
                  status={status}
                  tasks={tasksByStatus[status]}
                  onTaskClick={handleTaskClick}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask ? (
                <Card className="w-[280px] shadow-xl border-l-4 opacity-90">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: activeTask.color }}
                      />
                      <span className="font-medium text-sm">{activeTask.name}</span>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </TooltipProvider>
  );
}