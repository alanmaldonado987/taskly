"use client";

import { useProjectStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  format,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addWeeks,
  isWeekend,
  isSameDay,
  differenceInDays,
} from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChevronDown,
  Filter,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const HOURS_PER_DAY = 8;
const DAY_WIDTH = 48;
const ROW_HEIGHT = 56;

export function WorkloadView() {
  const { project, setSelectedTask, setTaskModalOpen } = useProjectStore();
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  const currentWeekStart = startOfWeek(addWeeks(today, weekOffset));
  const currentWeekEnd = endOfWeek(addWeeks(today, weekOffset + 3));

  const days = useMemo(
    () => eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd }),
    [currentWeekStart, currentWeekEnd]
  );

  const workloadData = useMemo(() => {
    const data = {};

    project.members.forEach((member) => {
      data[member.id] = {};
      days.forEach((day) => {
        data[member.id][format(day, "yyyy-MM-dd")] = { hours: 0, tasks: [] };
      });
    });

    project.tasks.forEach((task) => {
      if (task.assignees.length === 0 || !task.estimatedHours) return;

      const taskDays = differenceInDays(task.endDate, task.startDate) + 1;
      const hoursPerDay = task.estimatedHours / taskDays / task.assignees.length;

      task.assignees.forEach((memberId) => {
        days.forEach((day) => {
          if (day >= task.startDate && day <= task.endDate) {
            const dateKey = format(day, "yyyy-MM-dd");
            if (data[memberId]?.[dateKey]) {
              data[memberId][dateKey].hours += hoursPerDay;
              data[memberId][dateKey].tasks.push(task);
            }
          }
        });
      });
    });

    return data;
  }, [project.tasks, project.members, days]);

  const getWorkloadColor = (hours) => {
    if (hours === 0) return "bg-transparent";
    if (hours <= HOURS_PER_DAY * 0.5) return "bg-green-200";
    if (hours <= HOURS_PER_DAY * 0.8) return "bg-green-400";
    if (hours <= HOURS_PER_DAY) return "bg-green-500";
    if (hours <= HOURS_PER_DAY * 1.2) return "bg-orange-400";
    return "bg-red-500";
  };

  const getWorkloadText = (hours) => {
    if (hours === 0) return "";
    return `${hours.toFixed(1)}h`;
  };

  const getWorkloadPercentage = (hours) => {
    return Math.min((hours / HOURS_PER_DAY) * 100, 100);
  };

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col overflow-hidden bg-card">
        <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-muted/30">
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
            Timeline
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
            Board
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
            List
          </Button>
          <Button variant="secondary" size="sm" className="h-7 text-xs font-medium">
            Workload
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setWeekOffset((prev) => prev - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setWeekOffset(0)}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setWeekOffset((prev) => prev + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
              <Filter className="w-3 h-3" />
              Filtrar
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 py-2 border-b border-border text-xs">
          <span className="text-muted-foreground">Carga de trabajo:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-200 rounded" />
            <span className="text-muted-foreground">{"< 50%"}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-400 rounded" />
            <span className="text-muted-foreground">50-80%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span className="text-muted-foreground">80-100%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-orange-400 rounded" />
            <span className="text-muted-foreground">100-120%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span className="text-muted-foreground">{"> 120%"}</span>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 flex-shrink-0 border-r border-border flex flex-col">
            <div className="h-14 border-b border-border bg-muted/30 flex items-center px-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="w-4 h-4" />
                Team Members
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {project.members.map((member) => {
                const totalHours = Object.values(workloadData[member.id] || {}).reduce(
                  (sum, day) => sum + day.hours,
                  0
                );
                const avgHours = totalHours / days.length;

                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 px-4 border-b border-border hover:bg-muted/50"
                    style={{ height: ROW_HEIGHT }}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback
                        style={{ backgroundColor: member.color, color: "white" }}
                        className="text-xs"
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
                        Avg: {avgHours.toFixed(1)}h/day
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div style={{ width: days.length * DAY_WIDTH, minHeight: "100%" }}>
              <div className="h-14 border-b border-border bg-muted/30 sticky top-0 z-10 flex">
                {days.map((day, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex-shrink-0 border-r border-border flex flex-col items-center justify-center",
                      isWeekend(day) && "bg-muted/50",
                      isSameDay(day, today) && "bg-primary/10"
                    )}
                    style={{ width: DAY_WIDTH }}
                  >
                    <span className="text-[10px] text-muted-foreground uppercase">
                      {format(day, "EEE")}
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isSameDay(day, today) && "text-primary"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative">
                {project.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex border-b border-border"
                    style={{ height: ROW_HEIGHT }}
                  >
                    {days.map((day, idx) => {
                      const dateKey = format(day, "yyyy-MM-dd");
                      const dayData = workloadData[member.id]?.[dateKey] || { hours: 0, tasks: [] };
                      const percentage = getWorkloadPercentage(dayData.hours);

                      return (
                        <Tooltip key={idx}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "flex-shrink-0 border-r border-border/50 flex items-center justify-center p-1",
                                isWeekend(day) && "bg-muted/30"
                              )}
                              style={{ width: DAY_WIDTH }}
                            >
                              {dayData.hours > 0 && (
                                <div
                                  className={cn(
                                    "w-full rounded flex items-center justify-center text-[10px] font-medium text-white",
                                    getWorkloadColor(dayData.hours)
                                  )}
                                  style={{ height: `${Math.max(percentage * 0.4, 20)}px` }}
                                >
                                  {getWorkloadText(dayData.hours)}
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-1">
                              <p className="font-medium">
                                {member.name} - {format(day, "MMM d")}
                              </p>
                              <p className="text-xs">
                                Carga de trabajo: {dayData.hours.toFixed(1)}h /{" "}
                                {HOURS_PER_DAY}h ({((dayData.hours / HOURS_PER_DAY) * 100).toFixed(0)}
                                %)
                              </p>
                              {dayData.tasks.length > 0 && (
                                <div className="border-t border-border pt-1 mt-1">
                                  <p className="text-xs text-muted-foreground mb-1">Tareas:</p>
                                  {dayData.tasks.map((task) => (
                                    <p
                                      key={task.id}
                                      className="text-xs flex items-center gap-1"
                                    >
                                      <span
                                        className="w-2 h-2 rounded-sm"
                                        style={{ backgroundColor: task.color }}
                                      />
                                      {task.name}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}