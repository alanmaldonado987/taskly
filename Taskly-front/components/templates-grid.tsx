import { ArrowRight, BarChart2, Target, Hammer, Calendar, Code2, Layout } from "lucide-react"

const templates = [
  { icon: BarChart2, title: "Plantilla gratuita de diagrama de Gantt" },
  { icon: Target, title: "Plantillas gratis de Gantt para marketing" },
  { icon: Hammer, title: "Plantillas gratis de Gantt para construccion" },
  { icon: Calendar, title: "Plantillas gratis de Gantt para eventos" },
  { icon: Code2, title: "Plantilla gratis de Gantt para software" },
  { icon: Layout, title: "Plantillas gratis de Gantt para diseno web" },
]

export function TemplatesGrid() {
  return (
    <section className="bg-background py-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="mx-auto max-w-[1240px] px-6">
        <h2 className="text-center text-[28px] font-bold tracking-tight text-primary md:text-[32px]">
          Empieza rapido con estas plantillas online gratuitas de Gantt
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => {
            const Icon = t.icon
            return (
              <div
                key={t.title}
                className="flex flex-col justify-between rounded-xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  <Icon className="h-7 w-7 text-[#2e7d5b]" aria-hidden="true" />
                  <h3 className="mt-4 text-[16px] font-semibold leading-snug text-primary">
                    {t.title}
                  </h3>
                </div>
                <a
                  href="#"
                  className="mt-6 inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
                >
                  Usar plantilla <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
