const awards = [
  { top: "Alto rendimiento", bottom: "G2 · 2026" },
  { top: "GetApp", bottom: "Lideres de categoria" },
  { top: "Capterra", bottom: "Lista corta 2026" },
  { top: "Mejor", bottom: "Software Advice" },
  { top: "Capterra", bottom: "Mejor facilidad de uso" },
  { top: "Usuarios", bottom: "Nos recomiendan" },
]

export function Awards() {
  return (
    <section className="bg-background pb-20 animate-in fade-in duration-700">
      <div className="mx-auto max-w-[1240px] px-6">
        <p className="text-center text-[14px] font-medium text-muted-foreground">
          Software de gestion de proyectos mejor valorado por plataformas lideres de reseñas de negocio
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          {awards.map((a) => (
            <div
              key={a.top + a.bottom}
              className="flex h-20 w-20 flex-col items-center justify-center rounded-full border border-border bg-white px-2 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-[10px] font-bold leading-tight text-primary">{a.top}</span>
              <span className="mt-0.5 text-[9px] leading-tight text-muted-foreground">
                {a.bottom}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <a href="#" className="text-[13px] font-semibold text-primary hover:underline">
            Ver mas reconocimientos
          </a>
        </div>
      </div>
    </section>
  )
}
