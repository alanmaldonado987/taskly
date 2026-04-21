"use client";

import { cn } from "@/lib/utils";
import { useProjectStore } from "@/lib/store";
import {
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Columns3,
  GanttChart,
  Users,
  Calendar,
  Settings,
  Plus,
  FolderKanban,
  Milestone,
  Link2,
  Filter,
  Download,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navSections = [
  {
    title: "Vistas",
    items: [
      { id: "gantt", label: "Diagrama de Gantt", icon: GanttChart, view: "gantt" },
      { id: "board", label: "Tablero", icon: Columns3, view: "board" },
      { id: "grid", label: "Lista", icon: LayoutGrid, view: "grid" },
      { id: "calendar", label: "Calendario", icon: Calendar, view: "calendar" },
      { id: "workload", label: "Carga de trabajo", icon: Users, view: "workload" },
      { id: "people", label: "Personas", icon: Users, view: "people" },
      { id: "dashboard", label: "Panel de control", icon: GanttChart, view: "dashboard" },
    ],
  },
  {
    title: "Planificacion",
    items: [
      { id: "milestones", label: "Hitos", icon: Milestone },
      { id: "dependencies", label: "Dependencias", icon: Link2 },
      { id: "filter", label: "Filtro", icon: Filter },
    ],
  },
  {
    title: "Gestion de Proyecto",
    items: [
      { id: "baseline", label: "Linea base", icon: GanttChart },
      { id: "critical-path", label: "Ruta critica", icon: GanttChart },
    ],
  },
  {
    title: "Importar y Exportar",
    items: [
      { id: "import", label: "Importar", icon: Upload },
      { id: "export", label: "Exportar", icon: Download },
    ],
  },
];

export function AppSidebar() {
  const { currentView, setCurrentView, isSidebarCollapsed, project } = useProjectStore();
  const [expandedSections, setExpandedSections] = useState(["Vistas", "Planificacion"]);

  const toggleSection = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  if (isSidebarCollapsed) {
    return (
      <aside className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-3 border-b border-sidebar-border">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <GanttChart className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
        <nav className="flex-1 p-2">
          {navSections[0].items.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              className={cn(
                "w-full mb-1 cursor-pointer",
                item.view === currentView && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
              onClick={() => item.view && setCurrentView(item.view)}
            >
              <item.icon className="w-5 h-5" />
            </Button>
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <GanttChart className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground text-lg tracking-tight">
              Taskly
            </h1>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-sidebar-foreground truncate">
            {project.name}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {project.tasks.length} tareas
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navSections.map((section) => (
          <Collapsible
            key={section.title}
            open={expandedSections.includes(section.title)}
            onOpenChange={() => toggleSection(section.title)}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-primary uppercase tracking-wider hover:bg-sidebar-accent/50 cursor-pointer">
              <span>{section.title}</span>
              {expandedSections.includes(section.title) ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-700 ease-out" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform duration-700 ease-out" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-in slide-in-from-top-4 duration-500">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors cursor-pointer",
                    item.view === currentView &&
                      "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  )}
                  onClick={() => item.view && setCurrentView(item.view)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </nav>

      {/* Add Task Button */}
      <div className="p-4 border-t border-sidebar-border">
        <Button className="w-full gap-2" size="sm">
          <Plus className="w-4 h-4" />
          Añadir tarea
        </Button>
      </div>

      {/* Settings */}
      <div className="p-2 border-t border-sidebar-border">
        <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md transition-colors cursor-pointer">
          <Settings className="w-4 h-4" />
          <span>Configuracion</span>
        </button>
      </div>
    </aside>
  );
}