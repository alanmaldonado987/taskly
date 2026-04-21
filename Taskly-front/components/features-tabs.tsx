"use client"

import { useState } from "react"
import {
  BarChart3,
  LayoutGrid,
  Users,
  Bell,
  GitBranch,
  Upload,
  Clock,
  FileText,
} from "lucide-react"

const tabs = [
  {
    id: "workload",
    label: "Carga de trabajo",
    icon: BarChart3,
    content: {
      title: "Carga de trabajo",
      text: [
        "Revisa la carga de trabajo de tu equipo y detecta si alguien tiene pocas tareas o, al contrario, demasiadas asignaciones.",
        "En Taskly es facil reasignar personas segun su disponibilidad y mantener al equipo motivado con tareas relevantes.",
      ],
    },
  },
  { id: "board", label: "Vista de tablero", icon: LayoutGrid },
  { id: "collab", label: "Colaboracion", icon: Users },
  { id: "notify", label: "Notificaciones", icon: Bell },
  { id: "relations", label: "Relaciones de tareas", icon: GitBranch },
  { id: "export", label: "Exportar", icon: Upload },
  { id: "time", label: "Registro de tiempo", icon: Clock },
  { id: "reports", label: "Reportes", icon: FileText },
]

export function FeaturesTabs() {
  const [active, setActive] = useState("workload")
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0]

  return (
    <section className="bg-background py-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="mb-3 text-center">
          <h2 className="text-[32px] font-bold tracking-tight text-primary md:text-[36px]">
            Funcionalidades de Taskly
          </h2>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Desde un diagrama simple hasta la gestion avanzada de proyectos.
          </p>
        </div>

        {/* Tab pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {tabs.map((t) => {
            const Icon = t.icon
            const isActive = t.id === active
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-[13px] font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-primary hover:bg-secondary/70"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="mt-12 grid grid-cols-1 items-center gap-10 rounded-2xl bg-secondary/50 p-8 lg:grid-cols-2 animate-in fade-in duration-700">
          <div className="h-64 rounded-xl bg-white ring-1 ring-border" />
          <div>
            <h3 className="text-[24px] font-bold text-primary">{activeTab.content?.title ?? activeTab.label}</h3>
            <div className="mt-4 space-y-3 text-[14px] leading-relaxed text-muted-foreground">
              {(activeTab.content?.text ?? [
                "Explora esta funcionalidad en Taskly. Capacidades potentes de gestion de proyectos integradas en cada pestana.",
              ]).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
