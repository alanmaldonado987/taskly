"use client";

import { useMemo } from "react";
import { useProjectStore } from "@/lib/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  Target,
  BarChart3,
} from "lucide-react";
import { format, differenceInDays, isAfter, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function DashboardView() {
  const { project, setSelectedTask, setTaskModalOpen, setCurrentView } = useProjectStore();

  const STATUS_LABELS = {
    open: "Abierto",
    "in-progress": "En Progreso",
    done: "Terminado",
    closed: "Cerrado",
  };

  const PRIORITY_LABELS = {
    highest: "Highest",
    high: "High",
    medium: "Medium",
    low: "Low",
    lowest: "Lowest",
  };

  const stats = useMemo(() => {
    const total = project.tasks.length;
    const completed = project.tasks.filter(
      (t) => t.status === "done" || t.status === "closed"
    ).length;
    const inProgress = project.tasks.filter(
      (t) => t.status === "in-progress"
    ).length;
    const open = project.tasks.filter((t) => t.status === "open").length;
    const overdue = project.tasks.filter((t) => {
      const endDate = new Date(t.endDate);
      return isBefore(endDate, new Date()) && t.status !== "done" && t.status !== "closed";
    }).length;

    const totalHours = project.tasks.reduce(
      (sum, t) => sum + (t.estimatedHours || 0),
      0
    );
    const loggedHours = project.tasks.reduce(
      (sum, t) => sum + (t.loggedHours || 0),
      0
    );

    const avgProgress =
      total > 0
        ? Math.round(
            project.tasks.reduce((sum, t) => sum + t.progress, 0) / total
          )
        : 0;

    return {
      total,
      completed,
      inProgress,
      open,
      overdue,
      totalHours,
      loggedHours,
      avgProgress,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [project.tasks]);

  const upcomingTasks = useMemo(() => {
    const today = new Date();
    return project.tasks
      .filter((t) => t.status !== "done" && t.status !== "closed")
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      .slice(0, 5);
  }, [project.tasks]);

  const recentActivity = useMemo(() => {
    return project.tasks
      .filter((t) => t.status === "done" || t.progress > 0)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5);
  }, [project.tasks]);

  const tasksByStatus = useMemo(() => {
    return [
      { status: "open", count: stats.open, color: "bg-gray-400" },
      { status: "in-progress", count: stats.inProgress, color: "bg-blue-500" },
      { status: "done", count: stats.completed, color: "bg-green-500" },
    ];
  }, [stats]);

  const getMemberById = (memberId) => {
    return project.members.find((m) => m.id === memberId);
  };

  return (
    <div className="h-full overflow-auto bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{project.name}</h1>
            <p className="text-muted-foreground mt-1">
              Panel de control del proyecto
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Última actualización</p>
            <p className="font-medium text-foreground">
              {format(new Date(project.updatedAt), "dd MMM yyyy, HH:mm", {
                locale: es,
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tareas</p>
                <p className="text-3xl font-semibold mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600">{stats.completionRate}% completado</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Progreso</p>
                <p className="text-3xl font-semibold mt-1">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <Progress value={(stats.inProgress / stats.total) * 100} className="mt-4 h-2" />
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completadas</p>
                <p className="text-3xl font-semibold mt-1">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>{stats.loggedHours}h registradas de {stats.totalHours}h estimadas</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Atrasadas</p>
                <p className="text-3xl font-semibold mt-1">{stats.overdue}</p>
              </div>
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center",
                stats.overdue > 0 ? "bg-red-100" : "bg-gray-100"
              )}>
                <AlertCircle className={cn(
                  "w-6 h-6",
                  stats.overdue > 0 ? "text-red-600" : "text-gray-400"
                )} />
              </div>
            </div>
            {stats.overdue > 0 && (
              <div className="mt-4 text-sm text-red-600">
                Requiere atención inmediata
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Resumen de Progreso
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                {tasksByStatus.map((item) => (
                  <div key={item.status} className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", item.color)} />
                    <span className="text-sm text-muted-foreground">
                      {STATUS_LABELS[item.status]}: {item.count}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-8 bg-muted rounded-full overflow-hidden flex">
                {tasksByStatus.map((item, index) => (
                  <div
                    key={item.status}
                    className={cn(item.color, "transition-all")}
                    style={{
                      width: `${(item.count / stats.total) * 100}%`,
                    }}
                  />
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progreso promedio</span>
                  <span className="text-sm font-semibold">{stats.avgProgress}%</span>
                </div>
                <Progress value={stats.avgProgress} className="h-2" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Equipo
            </h3>
            <div className="space-y-3">
              {project.members.map((member) => {
                const memberTasks = project.tasks.filter((t) =>
                  t.assignees.includes(member.id)
                );
                const completedTasks = memberTasks.filter(
                  (t) => t.status === "done" || t.status === "closed"
                ).length;

                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setCurrentView("people")}
                  >
                    <Avatar className="w-9 h-9">
                      <AvatarFallback
                        style={{ backgroundColor: member.color }}
                        className="text-white text-xs font-medium"
                      >
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {memberTasks.length} tareas · {completedTasks} completadas
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">
                        {memberTasks.length > 0
                          ? Math.round((completedTasks / memberTasks.length) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximas Tareas
            </h3>
            <div className="space-y-2">
              {upcomingTasks.map((task) => {
                const daysLeft = differenceInDays(new Date(task.endDate), new Date());
                const isOverdue = daysLeft < 0;

                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border border-border"
                    onClick={() => {
                      setSelectedTask(task.id);
                      setTaskModalOpen(true);
                    }}
                  >
                    <div
                      className="w-1 h-10 rounded-full"
                      style={{ backgroundColor: task.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(task.endDate), "dd MMM", { locale: es })}
                        </span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            isOverdue
                              ? "bg-red-100 text-red-700"
                              : daysLeft <= 3
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-700"
                          )}
                        >
                          {isOverdue
                            ? `${Math.abs(daysLeft)}d atrasada`
                            : daysLeft === 0
                            ? "Hoy"
                            : `${daysLeft}d restantes`}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      {task.assignees.slice(0, 2).map((assigneeId) => {
                        const member = getMemberById(assigneeId);
                        if (!member) return null;
                        return (
                          <Avatar key={assigneeId} className="w-6 h-6 border-2 border-card">
                            <AvatarFallback
                              style={{ backgroundColor: member.color }}
                              className="text-white text-[10px]"
                            >
                              {member.name[0]}
                            </AvatarFallback>
                          </Avatar>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {upcomingTasks.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No hay tareas próximas
                </p>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Actividad Reciente
            </h3>
            <div className="space-y-2">
              {recentActivity.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors border border-border"
                  onClick={() => {
                    setSelectedTask(task.id);
                    setTaskModalOpen(true);
                  }}
                >
                  <div
                    className="w-1 h-10 rounded-full"
                    style={{ backgroundColor: task.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={task.progress} className="h-1.5 w-20" />
                      <span className="text-xs text-muted-foreground">
                        {task.progress}%
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      task.status === "done" && "bg-green-100 text-green-700",
                      task.status === "in-progress" && "bg-blue-100 text-blue-700"
                    )}
                  >
                    {STATUS_LABELS[task.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}