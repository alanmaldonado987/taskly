"use client";

import { useState } from "react";
import { useProjectStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function PeopleView() {
  const { project, setSelectedTask, setTaskModalOpen } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  const getTasksForMember = (memberId) => {
    return project.tasks.filter((task) => task.assignees.includes(memberId));
  };

  const getCompletedTasksCount = (memberId) => {
    return project.tasks.filter(
      (task) =>
        task.assignees.includes(memberId) &&
        (task.status === "done" || task.status === "closed")
    ).length;
  };

  const getTotalHours = (memberId) => {
    const tasks = getTasksForMember(memberId);
    return {
      estimated: tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0),
      logged: tasks.reduce((sum, t) => sum + (t.loggedHours || 0), 0),
    };
  };

  const filteredMembers = project.members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMemberData = selectedMember
    ? project.members.find((m) => m.id === selectedMember)
    : null;

  const selectedMemberTasks = selectedMember
    ? getTasksForMember(selectedMember)
    : [];

  const STATUS_LABELS = {
    open: "Abierto",
    "in-progress": "En Progreso",
    done: "Terminado",
    closed: "Cerrado",
  };

  return (
    <div className="h-full flex bg-background">
      <div className="w-80 border-r border-border flex flex-col bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Personas</h2>
            <Button size="sm" className="gap-1 bg-primary text-primary-foreground">
              <Plus className="w-4 h-4" />
              Invitar
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar personas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {filteredMembers.map((member) => {
            const tasks = getTasksForMember(member.id);
            const completedTasks = getCompletedTasksCount(member.id);
            const completionRate = tasks.length > 0
              ? Math.round((completedTasks / tasks.length) * 100)
              : 0;

            return (
              <div
                key={member.id}
                className={cn(
                  "p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors",
                  selectedMember === member.id && "bg-muted"
                )}
                onClick={() => setSelectedMember(member.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback
                      style={{ backgroundColor: member.color }}
                      className="text-white text-sm font-medium"
                    >
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate">
                        {member.name}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                          <DropdownMenuItem>Enviar mensaje</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.email}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{tasks.length} tareas</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{completionRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            {project.members.length} miembros del equipo
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedMemberData ? (
          <>
            <div className="p-6 border-b border-border bg-card">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback
                    style={{ backgroundColor: selectedMemberData.color }}
                    className="text-white text-xl font-medium"
                  >
                    {selectedMemberData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">
                    {selectedMemberData.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{selectedMemberData.email}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {selectedMemberTasks.length} tareas asignadas
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {getCompletedTasksCount(selectedMember)} completadas
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar mensaje
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-semibold">
                    {selectedMemberTasks.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total tareas
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-semibold">
                    {selectedMemberTasks.filter((t) => t.status === "in-progress").length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    En progreso
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-semibold">
                    {getTotalHours(selectedMember).logged}h
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Horas registradas
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-semibold">
                    {selectedMemberTasks.length > 0
                      ? Math.round(
                          (getCompletedTasksCount(selectedMember) /
                            selectedMemberTasks.length) *
                            100
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tasa de completado
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Tareas asignadas</h3>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
              </div>
              <div className="space-y-2">
                {selectedMemberTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedTask(task.id);
                      setTaskModalOpen(true);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-1 h-full min-h-[40px] rounded-full"
                        style={{ backgroundColor: task.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{task.name}</h4>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              task.status === "done" &&
                                "bg-green-100 text-green-700",
                              task.status === "in-progress" &&
                                "bg-blue-100 text-blue-700",
                              task.status === "open" &&
                                "bg-gray-100 text-gray-700"
                            )}
                          >
                            {STATUS_LABELS[task.status]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {format(new Date(task.startDate), "dd/MM")} -{" "}
                              {format(new Date(task.endDate), "dd/MM/yyyy")}
                            </span>
                          </div>
                          {task.estimatedHours && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>
                                {task.loggedHours || 0}/{task.estimatedHours}h
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-2">
                          <Progress value={task.progress} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {selectedMemberTasks.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No hay tareas asignadas
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Selecciona una persona para ver sus detalles</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}