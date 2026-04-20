"use client";

import { useProjectStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  MoreHorizontal,
  GripVertical,
  Plus,
  ChevronDown,
  Filter,
  ArrowUp,
  ArrowDown,
  Diamond,
} from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function GridView() {
  const { project, selectedTaskId, setSelectedTask, setTaskModalOpen, updateTask } =
    useProjectStore();
  const [sortField, setSortField] = useState("startDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTasks, setSelectedTasks] = useState([]);

  const getMemberById = (id) => project.members.find((m) => m.id === id);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTasks = [...project.tasks].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "startDate":
        comparison = a.startDate.getTime() - b.startDate.getTime();
        break;
      case "endDate":
        comparison = a.endDate.getTime() - b.endDate.getTime();
        break;
      case "priority":
        const priorityOrder = ["highest", "high", "medium", "low", "lowest"];
        comparison = priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
        break;
      case "status":
        const statusOrder = ["open", "in-progress", "done", "closed"];
        comparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        break;
      case "progress":
        comparison = a.progress - b.progress;
        break;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const toggleAllTasks = () => {
    if (selectedTasks.length === project.tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(project.tasks.map((t) => t.id));
    }
  };

  const SortButton = ({ field, children }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 -ml-2 font-medium text-muted-foreground hover:text-foreground"
      onClick={() => handleSort(field)}
    >
      {children}
      {sortField === field ? (
        sortDirection === "asc" ? (
          <ArrowUp className="ml-1 h-3 w-3" />
        ) : (
          <ArrowDown className="ml-1 h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
      )}
    </Button>
  );

  const STATUS_LABELS = {
    open: "Abierto",
    "in-progress": "En Progreso",
    done: "Terminado",
    closed: "Cerrado",
  };

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col overflow-hidden bg-card">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
          <Checkbox className="mr-2" />
          <Button variant="default" size="sm" className="h-8 gap-1 bg-primary text-primary-foreground">
            <Plus className="w-4 h-4" />
            Añadir
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-muted-foreground">
              Campos
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <Filter className="w-3 h-3" />
              Filtro
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-muted-foreground">
              Exportar
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-muted-foreground">
              Vista <ChevronDown className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedTasks.length === project.tasks.length}
                    onCheckedChange={toggleAllTasks}
                  />
                </TableHead>
                <TableHead className="min-w-[300px]">
                  <SortButton field="name">Nombre de tarea</SortButton>
                </TableHead>
                <TableHead className="w-32">
                  <SortButton field="startDate">Fecha de inicio</SortButton>
                </TableHead>
                <TableHead className="w-40">Asignado</TableHead>
                <TableHead className="w-32">
                  <SortButton field="status">Estado</SortButton>
                </TableHead>
                <TableHead className="w-36">Registro de tiempo</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task) => (
                <TableRow
                  key={task.id}
                  className={cn(
                    "cursor-pointer",
                    selectedTaskId === task.id && "bg-accent",
                    selectedTasks.includes(task.id) && "bg-muted/50"
                  )}
                  onClick={() => {
                    setSelectedTask(task.id);
                    setTaskModalOpen(true);
                  }}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onCheckedChange={() => toggleTaskSelection(task.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 cursor-grab"
                      >
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      {task.isMilestone ? (
                        <Diamond className="w-4 h-4 text-primary flex-shrink-0" />
                      ) : (
                        <div
                          className="w-3 h-3 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: task.color }}
                        />
                      )}
                      <span className="font-medium truncate">{task.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(task.startDate, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-1">
                      {task.assignees.slice(0, 3).map((assigneeId) => {
                        const member = getMemberById(assigneeId);
                        if (!member) return null;
                        return (
                          <Tooltip key={assigneeId}>
                            <TooltipTrigger>
                              <Avatar className="w-7 h-7 border-2 border-background">
                                <AvatarFallback
                                  className="text-xs"
                                  style={{ backgroundColor: member.color, color: "white" }}
                                >
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>{member.name}</TooltipContent>
                          </Tooltip>
                        );
                      })}
                      {task.assignees.length > 3 && (
                        <Avatar className="w-7 h-7 border-2 border-background">
                          <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                            +{task.assignees.length - 3}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {task.assignees.length === 0 && (
                        <span className="text-sm text-muted-foreground">sin asignar</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      <span className="text-sm">{STATUS_LABELS[task.status]}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right">
                    {task.loggedHours || 0}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
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
                  </TableCell>
                </TableRow>
              ))}

              <TableRow className="hover:bg-muted/30">
                <TableCell colSpan={7}>
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="gap-2 text-primary">
                      <Plus className="w-4 h-4" />
                      Añadir tarea
                    </Button>
                    <span className="text-muted-foreground">|</span>
                    <Button variant="ghost" size="sm" className="gap-2 text-primary">
                      Añadir hito
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}