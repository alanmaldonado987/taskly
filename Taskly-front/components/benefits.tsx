import Image from "next/image"

export function Benefits() {
  return (
    <section className="bg-background py-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-balance text-[32px] font-bold leading-tight tracking-tight text-primary md:text-[36px]">
              Beneficios de usar
              <br />
              nuestro creador
              <br />
              de Taskly
            </h2>
          </div>
          <div className="overflow-hidden rounded-xl ring-1 ring-border transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
            <Image
              src="/hero-gantt-chart.jpg"
              alt="Planificacion eficiente con diagramas de Gantt"
              width={820}
              height={420}
              className="h-auto w-full"
            />
          </div>
        </div>
        <p className="mt-5 text-right text-[15px] font-semibold text-primary lg:pl-[40%]">
          Planificacion online eficiente con diagramas de Gantt
        </p>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              img: "/benefit-planning.jpg",
              title: "Visualizacion clara del plan y cronograma",
            },
            {
              img: "/benefit-collaboration.jpg",
              title: "Colaboracion fluida con diagramas de Gantt online",
            },
            {
              img: "/benefit-sharing.jpg",
              title: "Facil de compartir y presentar un plan de proyecto",
            },
          ].map((b) => (
            <div key={b.title} className="transition-all duration-300 hover:-translate-y-1">
              <div className="overflow-hidden rounded-xl bg-secondary ring-1 ring-border transition-all duration-300 hover:shadow-md">
                <Image
                  src={b.img || "/placeholder.svg"}
                  alt={b.title}
                  width={400}
                  height={240}
                  className="h-auto w-full"
                />
              </div>
              <h3 className="mt-4 text-[17px] font-semibold text-primary">{b.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
