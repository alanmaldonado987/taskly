export function FinalCta() {
  return (
    <section className="bg-background pb-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="rounded-2xl bg-primary px-6 py-14 text-center md:py-20">
          <h2 className="text-balance text-[28px] font-bold leading-tight tracking-tight text-primary-foreground md:text-[34px]">
            Planifica, gestiona y controla tareas y proyectos
            <br className="hidden md:block" />
            con el potente generador de Gantt <span className="text-accent">Taskly</span>
          </h2>
          <a
            href="#"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-accent px-7 py-3 text-[14px] font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/85"
          >
            Generar un diagrama de Gantt
          </a>
        </div>
      </div>
    </section>
  )
}
