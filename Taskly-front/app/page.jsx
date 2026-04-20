"use client";

import { useProjectStore } from "@/lib/store";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { GanttChart } from "@/components/gantt-chart";
import { GridView } from "@/components/grid-view";
import { BoardView } from "@/components/board-view";
import { WorkloadView } from "@/components/workload-view";
import { CalendarView } from "@/components/calendar-view";
import { PeopleView } from "@/components/people-view";
import { DashboardView } from "@/components/dashboard-view";
import { TaskModal } from "@/components/task-modal";

export default function Home() {
  const { currentView } = useProjectStore();

  const renderView = () => {
    switch (currentView) {
      case "gantt":
        return <GanttChart />;
      case "grid":
        return <GridView />;
      case "board":
        return <BoardView />;
      case "workload":
        return <WorkloadView />;
      case "calendar":
        return <CalendarView />;
      case "people":
        return <PeopleView />;
      case "dashboard":
        return <DashboardView />;
      default:
        return <GanttChart />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden">
          {renderView()}
        </main>
      </div>
      <TaskModal />
    </div>
  );
}