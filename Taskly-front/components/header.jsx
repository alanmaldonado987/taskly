"use client";

import { useProjectStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Bell,
  HelpCircle,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  Share2,
  Download,
  Undo2,
  Redo2,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
  const {
    isSidebarCollapsed,
    setSidebarCollapsed,
    zoomLevel,
    setZoomLevel,
    currentView,
    project,
  } = useProjectStore();

  const zoomOptions = [
    { value: "day", label: "Día" },
    { value: "week", label: "Semana" },
    { value: "month", label: "Mes" },
  ];

  const viewTitles = {
    gantt: "Diagrama de Gantt",
    grid: "Lista",
    board: "Tablero",
    workload: "Carga de trabajo",
    calendar: "Calendario",
    people: "Personas",
    dashboard: "Panel de control",
  };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="text-muted-foreground hover:text-foreground"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </Button>

        <div className="h-6 w-px bg-border" />

        <h2 className="text-base font-semibold text-foreground">
          {viewTitles[currentView]}
        </h2>

        <span className="text-sm text-muted-foreground">
          {project.name}
        </span>
      </div>

      {/* Center Section - Toolbar */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-muted-foreground"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-muted-foreground"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-muted-foreground"
            onClick={() => {
              const currentIndex = zoomOptions.findIndex((z) => z.value === zoomLevel);
              if (currentIndex < zoomOptions.length - 1) {
                setZoomLevel(zoomOptions[currentIndex + 1].value);
              }
            }}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-3 text-sm font-medium"
              >
                {zoomOptions.find((z) => z.value === zoomLevel)?.label}
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {zoomOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setZoomLevel(option.value)}
                  className={zoomLevel === option.value ? "bg-accent" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-muted-foreground"
            onClick={() => {
              const currentIndex = zoomOptions.findIndex((z) => z.value === zoomLevel);
              if (currentIndex > 0) {
                setZoomLevel(zoomOptions[currentIndex - 1].value);
              }
            }}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Share2 className="w-4 h-4" />
          Compartir
        </Button>

        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar tareas..."
            className="w-52 h-8 pl-9 bg-secondary/50 border-0 focus-visible:ring-1"
          />
        </div>

        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <HelpCircle className="w-5 h-5" />
        </Button>

        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  JD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configuracion</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Cerrar sesion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}