"use client";

import { useState, useMemo } from "react";
import { useProjectStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  isToday,
} from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function CalendarView() {
  const { project, setSelectedTask, setTaskModalOpen } = useProjectStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getTasksForDay = (day) => {
    return project.tasks.filter((task) => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      return isWithinInterval(day, { start: taskStart, end: taskEnd }) ||
        isSameDay(day, taskStart) ||
        isSameDay(day, taskEnd);
    });
  };

  const getMemberById = (memberId) => {
    return project.members.find((m) => m.id === memberId);
  };

  const weekDays = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Hoy
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <h2 className="text-lg font-semibold capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: es })}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-secondary rounded-lg p-1">
            <Button
              variant={viewMode === "month" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "h-7 px-3",
                viewMode === "month" && "bg-card shadow-sm"
              )}
              onClick={() => setViewMode("month")}
            >
              Mes
            </Button>
            <Button
              variant={viewMode === "week" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "h-7 px-3",
                viewMode === "week" && "bg-card shadow-sm"
              )}
              onClick={() => setViewMode("week")}
            >
              Semana
            </Button>
          </div>
          <Button size="sm" className="gap-1 bg-primary text-primary-foreground">
            <Plus className="w-4 h-4" />
            Añadir
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7 border-b border-border bg-muted/30">
          {weekDays.map((day) => (
            <div
              key={day}
              className="px-2 py-3 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 flex-1">
          {calendarDays.map((day, index) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[120px] border-b border-r border-border p-1 transition-colors",
                  !isCurrentMonth && "bg-muted/20",
                  isCurrentDay && "bg-primary/5"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                      !isCurrentMonth && "text-muted-foreground",
                      isCurrentDay && "bg-primary text-primary-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {dayTasks.length}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <TooltipProvider>
                    {dayTasks.slice(0, 3).map((task) => {
                      const assignee = task.assignees[0]
                        ? getMemberById(task.assignees[0])
                        : null;

                      return (
                        <Tooltip key={task.id}>
                          <TooltipTrigger asChild>
                            <div
                              className="px-2 py-1 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity truncate"
                              style={{
                                backgroundColor: task.color.startsWith("var(")
                                  ? undefined
                                  : task.color,
                                background: task.color.startsWith("var(")
                                  ? `oklch(from ${task.color} l c h / 0.2)`
                                  : undefined,
                                color: task.color.startsWith("var(")
                                  ? `oklch(from ${task.color} calc(l - 0.3) c h)`
                                  : "#fff",
                              }}
                              onClick={() => {
                                setSelectedTask(task.id);
                                setTaskModalOpen(true);
                              }}
                            >
                              <div className="flex items-center gap-1">
                                {task.isMilestone && (
                                  <span className="text-[10px]">◆</span>
                                )}
                                <span className="truncate">{task.name}</span>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <p className="font-medium">{task.name}</p>
                              <p className="text-muted-foreground">
                                {format(new Date(task.startDate), "dd/MM")} -{" "}
                                {format(new Date(task.endDate), "dd/MM/yyyy")}
                              </p>
                              {assignee && (
                                <p className="text-muted-foreground">
                                  {assignee.name}
                                </p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-muted-foreground px-2">
                      +{dayTasks.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}