import Image from "next/image"
import { Award, BadgeCheck, ShieldCheck, Star } from "lucide-react"

export function Hero() {
  return (
    <section className="bg-secondary pb-20 pt-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <h1 className="text-balance text-[44px] font-bold leading-[1.1] tracking-tight text-primary md:text-[52px]">
            Creador online de <span className="text-[#2e7d5b]">diagramas de Gantt</span>
            <br />
            para la gestion
            <br />
            de proyectos
          </h1>
          <p className="mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-primary/80">
            Planifica y gestiona tareas simples y proyectos complejos con un software profesional de diagramas de Gantt.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Registrate con email
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/20 bg-white px-6 py-3 text-[14px] font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/80"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                />
              </svg>
              Continuar con Google
            </a>
          </div>

          <p className="mt-4 text-[13px] text-primary/70">
            Prueba gratis por 14 dias las funciones premium. No necesitas tarjeta.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#f4b400] text-[#f4b400]" aria-hidden="true" />
              ))}
            </div>
            <span className="text-[13px] text-primary/80">
              basado en <span className="font-semibold">1000+</span> reseñas
            </span>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#2e7d5b] ring-1 ring-border">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#ff6b2b] ring-1 ring-border">
                <Award className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#e5484d] ring-1 ring-border">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>

          <div className="relative">
          <div className="overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_-30px_rgba(0,0,0,0.45)]">
            <Image
              src="/hero-gantt-chart.jpg"
              alt="Interfaz online de Taskly con barras de tareas y linea de tiempo"
              width={820}
              height={520}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
