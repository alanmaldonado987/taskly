const logos = ["SONY", "NVIDIA.", "Mercedes-Benz", "Booking.com", "Nestlé", "Salesforce"]

export function TrustBar() {
  return (
    <section className="bg-secondary pb-16 animate-in fade-in duration-700">
      <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-6 px-6 lg:flex-row">
        <div className="shrink-0 text-primary">
          <div className="text-[22px] font-bold leading-none">1M+</div>
          <div className="mt-1 text-[11px] leading-tight text-primary/70">
            gestores de proyectos crean y
            <br />
            gestionan diagramas de Gantt con
            <br />
            Taskly
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-around gap-x-8 gap-y-4 opacity-80">
          {logos.map((logo) => (
            <span
              key={logo}
              className="font-serif text-[15px] font-semibold tracking-wide text-primary/70 transition-all duration-300 hover:-translate-y-0.5 hover:text-primary"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
