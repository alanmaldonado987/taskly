import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const items = [
  {
    img: "/feature-interface.jpg",
    title: "Interfaz intuitiva y personalizable",
    text: "Empieza en minutos con una interfaz amigable. Aprovecha opciones avanzadas con un planificador online escalable y adaptable.",
  },
  {
    img: "/feature-workload.jpg",
    title: "Gestion de carga de trabajo",
    text: "Logra el equilibrio ideal en la asignacion de recursos, evitando sobrecarga o subutilizacion. Nuestro planificador mejora la precision y eficiencia.",
  },
  {
    img: "/feature-views.jpg",
    title: "Vistas multiples",
    text: "Elige la visualizacion que mejor se adapte a tu proyecto: Gantt, tablero tipo Kanban o lista. Supervisa multiples proyectos con la vista Portafolio.",
  },
]

export function AdvancedPlanning() {
  return (
    <section className="bg-background py-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="mx-auto max-w-[1240px] px-6">
        <h2 className="text-balance text-center text-[32px] font-bold leading-tight tracking-tight text-primary md:text-[36px]">
          Planificacion y gestion avanzada de proyectos con
          <br />una herramienta de Gantt simple
        </h2>

        <div className="relative mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="transition-all duration-300 hover:-translate-y-1">
              <div className="overflow-hidden rounded-xl bg-white ring-1 ring-border transition-all duration-300 hover:shadow-md">
                <Image
                  src={item.img || "/placeholder.svg"}
                  alt={item.title}
                  width={420}
                  height={260}
                  className="h-auto w-full"
                />
              </div>
              <h3 className="mt-5 text-[18px] font-semibold text-primary">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}

          <button
            aria-label="Anterior"
            className="absolute -left-4 top-1/3 hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white shadow ring-1 ring-border transition-all duration-300 hover:scale-105 md:flex"
          >
            <ChevronLeft className="h-4 w-4 text-primary" />
          </button>
          <button
            aria-label="Siguiente"
            className="absolute -right-4 top-1/3 hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white shadow ring-1 ring-border transition-all duration-300 hover:scale-105 md:flex"
          >
            <ChevronRight className="h-4 w-4 text-primary" />
          </button>
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Probar gratis la herramienta de planificacion
          </a>
        </div>
      </div>
    </section>
  )
}
