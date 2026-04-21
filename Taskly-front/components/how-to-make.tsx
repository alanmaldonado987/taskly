import Image from "next/image"

const steps = [
  {
    n: 1,
    text: "Registrate en Taskly y crea un nuevo proyecto o usa una plantilla gratuita para tu industria.",
  },
  {
    n: 2,
    text: "Agrega tareas, fechas y recursos, y deja que el sistema construya automaticamente tu diagrama de Gantt.",
  },
  {
    n: 3,
    text: "Empieza a trabajar individualmente o con tu equipo y comparte el plan cuando lo necesites.",
  },
]

export function HowToMake() {
  return (
    <section className="bg-secondary py-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-balance text-[32px] font-bold leading-tight tracking-tight text-primary md:text-[36px]">
            Crear un diagrama de Gantt online en
            <br />
            Taskly es facil
          </h2>

          <ol className="mt-8 space-y-5">
            {steps.map((s) => (
              <li key={s.n} className="flex items-start gap-4 transition-all duration-300 hover:translate-x-1">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
                  {s.n}
                </span>
                <p className="text-[15px] leading-relaxed text-primary/90">{s.text}</p>
              </li>
            ))}
          </ol>

          <a
            href="#"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Crear un diagrama de Gantt online
          </a>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-border transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
            <Image
              src="/tablet-gantt.jpg"
              alt="Tablet mostrando un diagrama de Gantt"
              width={720}
              height={480}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
