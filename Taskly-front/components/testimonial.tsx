import { ChevronLeft, ChevronRight } from "lucide-react"

export function Testimonial() {
  return (
    <section className="bg-background pb-20 animate-in fade-in duration-700">
      <div className="mx-auto max-w-[1240px] px-6">
        <h2 className="text-center text-[28px] font-bold tracking-tight text-primary md:text-[32px]">
          Lo que opinan nuestros clientes sobre el creador de Gantt
        </h2>

        <div className="mt-10 rounded-2xl bg-primary p-10 md:p-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="md:max-w-[30%]">
              <div className="mb-6 h-12 w-12 rounded-full bg-accent/40" aria-hidden="true" />
              <div className="text-[15px] font-semibold text-primary-foreground">Ben Emmons</div>
              <div className="mt-1 text-[13px] text-primary-foreground/70">Director de Proyectos Especiales en MagMod</div>
            </div>
            <div className="relative md:max-w-[60%]">
              <div className="absolute -top-6 left-0 font-serif text-[60px] leading-none text-accent/70">
                &ldquo;
              </div>
              <p className="text-pretty text-[16px] leading-relaxed text-primary-foreground/95">
                Taskly nos dio un conjunto completo de funcionalidades sin volverse complejo ni costoso.
                La herramienta hace muy bien lo esencial: la gestion de proyectos. Ofrece una interfaz
                intuitiva y atractiva para dar seguimiento a tareas, dependencias y recursos.
              </p>
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-2">
            <button
              aria-label="Testimonio anterior"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-primary-foreground/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              aria-label="Siguiente testimonio"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-accent text-primary transition-all duration-300 hover:scale-105 hover:bg-accent/80"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
