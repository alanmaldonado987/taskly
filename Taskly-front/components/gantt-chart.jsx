"use client";

import { useProjectStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  format,
  differenceInDays,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isWeekend,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  getWeek,
} from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ChevronRight,
  ChevronDown,
  GripVertical,
  MoreHorizontal,
  ArrowUpRight,
  Diamond,
} from "lucide-react";
import { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DAY_WIDTH = 40;
const WEEK_DAY_WIDTH = 20;
const MONTH_DAY_WIDTH = 8;
const ROW_HEIGHT = 44;

export function GanttChart() {
  const { project, zoomLevel, selectedTaskId, setSelectedTask, setTaskModalOpen, updateTask } =
    useProjectStore();
  const [expandedGroups, setExpandedGroups] = useState([]);
  const chartRef = useRef(null);

  const dayWidth = useMemo(() => {
    switch (zoomLevel) {
      case "day":
        return DAY_WIDTH;
      case "week":
        return WEEK_DAY_WIDTH;
      case "month":
        return MONTH_DAY_WIDTH;
    }
  }, [zoomLevel]);

  const dateRange = useMemo(() => {
    if (project.tasks.length === 0) {
      const today = new Date();
      return {
        start: startOfMonth(today),
        end: endOfMonth(addDays(today, 60)),
      };
    }

    const dates = project.tasks.flatMap((t) => [t.startDate, t.endDate]);
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    return {
      start: addDays(startOfWeek(minDate), -7),
      end: addDays(endOfWeek(maxDate), 14),
    };
  }, [project.tasks]);

  const days = useMemo(
    () => eachDayOfInterval({ start: dateRange.start, end: dateRange.end }),
    [dateRange]
  );

  const weeks = useMemo(
    () =>
      eachWeekOfInterval({ start: dateRange.start, end: dateRange.end }).map((weekStart) => ({
        start: weekStart,
        end: endOfWeek(weekStart),
        number: getWeek(weekStart),
      })),
    [dateRange]
  );

  const today = new Date();
  const todayIndex = days.findIndex((d) => isSameDay(d, today));

  const getTaskPosition = (task) => {
    const startIndex = differenceInDays(task.startDate, dateRange.start);
    const duration = differenceInDays(task.endDate, task.startDate) + 1;
    return {
      left: startIndex * dayWidth,
      width: duration * dayWidth,
    };
  };

  const getMemberById = (id) => project.members.find((m) => m.id === id);

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col overflow-hidden bg-card">
        <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-muted/30">
          <Button variant="secondary" size="sm" className="h-7 text-xs font-medium">
            Timeline
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
            Board
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
            List
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
            Workload
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
              Expand/Collapse
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
              Bulk change
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
              Filter
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 flex-shrink-0 border-r border-border flex flex-col">
            <div className="h-16 border-b border-border bg-muted/30 flex items-end">
              <div className="flex items-center h-10 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Task name
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {project.tasks.map((task, index) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center h-11 px-2 border-b border-border hover:bg-muted/50 cursor-pointer group",
                    selectedTaskId === task.id && "bg-accent"
                  )}
                  onClick={() => {
                    setSelectedTask(task.id);
                    setTaskModalOpen(true);
                  }}
                >
                  <Button variant="ghost" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                  </Button>

                  {task.isMilestone ? (
                    <Diamond className="w-4 h-4 text-primary mx-1" />
                  ) : (
                    <div
                      className="w-3 h-3 rounded-sm mx-1"
                      style={{ backgroundColor: task.color }}
                    />
                  )}

                  <span className="flex-1 text-sm text-foreground truncate ml-2">
                    {task.name}
                  </span>

                  {task.assignees.length > 0 && (
                    <div className="flex -space-x-1">
                      {task.assignees.slice(0, 2).map((assigneeId) => {
                        const member = getMemberById(assigneeId);
                        if (!member) return null;
                        return (
                          <Tooltip key={assigneeId}>
                            <TooltipTrigger>
                              <Avatar className="w-6 h-6 border-2 border-background">
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
                      {task.assignees.length > 2 && (
                        <Avatar className="w-6 h-6 border-2 border-background">
                          <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                            +{task.assignees.length - 2}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit task</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto" ref={chartRef}>
            <div style={{ width: days.length * dayWidth, minHeight: "100%" }}>
              <div className="h-16 border-b border-border bg-muted/30 sticky top-0 z-10">
                <div className="h-8 flex border-b border-border">
                  {weeks.map((week, idx) => {
                    const weekDays = eachDayOfInterval({
                      start: week.start,
                      end: week.end > dateRange.end ? dateRange.end : week.end,
                    });
                    return (
                      <div
                        key={idx}
                        className="flex-shrink-0 border-r border-border px-2 flex items-center"
                        style={{ width: weekDays.length * dayWidth }}
                      >
                        <span className="text-xs font-medium text-muted-foreground">
                          {format(week.start, "MMM d")} - {format(week.end, "d")}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="h-8 flex">
                  {days.map((day, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex-shrink-0 border-r border-border flex items-center justify-center",
                        isWeekend(day) && "bg-muted/50",
                        isSameDay(day, today) && "bg-primary/10"
                      )}
                      style={{ width: dayWidth }}
                    >
                      <span
                        className={cn(
                          "text-xs",
                          isWeekend(day) ? "text-muted-foreground" : "text-foreground",
                          isSameDay(day, today) && "font-semibold text-primary"
                        )}
                      >
                        {dayWidth >= 20 ? format(day, "d") : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex">
                  {days.map((day, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex-shrink-0 border-r border-border/50 h-full",
                        isWeekend(day) && "bg-muted/30"
                      )}
                      style={{ width: dayWidth }}
                    />
                  ))}
                </div>

                {todayIndex >= 0 && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-primary z-20"
                    style={{ left: todayIndex * dayWidth + dayWidth / 2 }}
                  />
                )}

                {project.tasks.map((task, index) => {
                  const { left, width } = getTaskPosition(task);

                  if (task.isMilestone) {
                    return (
                      <div
                        key={task.id}
                        className="absolute flex items-center justify-center"
                        style={{
                          left: left + width / 2 - 10,
                          top: index * ROW_HEIGHT + (ROW_HEIGHT - 20) / 2,
                          width: 20,
                          height: 20,
                        }}
                      >
                        <Tooltip>
                          <TooltipTrigger>
                            <Diamond
                              className="w-5 h-5 text-primary fill-primary cursor-pointer hover:scale-110 transition-transform"
                              onClick={() => {
                                setSelectedTask(task.id);
                                setTaskModalOpen(true);
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-medium">{task.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(task.startDate, "MMM d, yyyy")}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={task.id}
                      className="absolute"
                      style={{
                        left,
                        top: index * ROW_HEIGHT + 6,
                        width,
                        height: ROW_HEIGHT - 12,
                      }}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "h-full rounded-md cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden group",
                              selectedTaskId === task.id && "ring-2 ring-primary ring-offset-1"
                            )}
                            style={{ backgroundColor: task.color }}
                            onClick={() => {
                              setSelectedTask(task.id);
                              setTaskModalOpen(true);
                            }}
                          >
                            <div
                              className="absolute inset-y-0 left-0 bg-black/20 rounded-l-md"
                              style={{ width: `${task.progress}%` }}
                            />

                            {width > 60 && (
                              <div className="absolute inset-0 flex items-center px-2">
                                <span className="text-xs text-white font-medium truncate">
                                  {task.name}
                                </span>
                              </div>
                            )}

                            <div className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-black/30 rounded-l-md" />
                            <div className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 bg-black/30 rounded-r-md" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-medium">{task.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(task.startDate, "MMM d")} -{" "}
                              {format(task.endDate, "MMM d, yyyy")}
                            </p>
                            <div className="flex items-center gap-2">
                              <Progress value={task.progress} className="h-1.5 flex-1" />
                              <span className="text-xs">{task.progress}%</span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>

                      {task.dependencies.map((depId) => {
                        const depTask = project.tasks.find((t) => t.id === depId);
                        if (!depTask) return null;
                        const depPosition = getTaskPosition(depTask);
                        const depIndex = project.tasks.findIndex((t) => t.id === depId);

                        return (
                          <svg
                            key={depId}
                            className="absolute pointer-events-none"
                            style={{
                              left: -left + depPosition.left + depPosition.width,
                              top: (depIndex - index) * ROW_HEIGHT + ROW_HEIGHT / 2 - 6,
                              width: left - (depPosition.left + depPosition.width),
                              height: Math.abs(index - depIndex) * ROW_HEIGHT + 12,
                              overflow: "visible",
                            }}
                          >
                            <path
                              d={`M0,${(index > depIndex ? 0 : Math.abs(index - depIndex) * ROW_HEIGHT + 12)} 
                                 L${(left - (depPosition.left + depPosition.width)) / 2},${(index > depIndex ? 0 : Math.abs(index - depIndex) * ROW_HEIGHT + 12)} 
                                 L${(left - (depPosition.left + depPosition.width)) / 2},${index > depIndex ? Math.abs(index - depIndex) * ROW_HEIGHT + 12 : 0} 
                                 L${left - (depPosition.left + depPosition.width)},${index > depIndex ? Math.abs(index - depIndex) * ROW_HEIGHT + 12 : 0}`}
                              fill="none"
                              stroke="var(--muted-foreground)"
                              strokeWidth="1"
                              strokeDasharray="4,2"
                            />
                          </svg>
                        );
                      })}
                    </div>
                  );
                })}

                <div style={{ height: project.tasks.length * ROW_HEIGHT }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}