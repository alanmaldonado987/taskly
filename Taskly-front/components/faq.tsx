"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    q: "Cuando debo usar una herramienta de gestion con diagrama de Gantt?",
    a: "Siempre que planifiques trabajo con varias etapas, dependencias, fechas limite o multiples responsables, un Gantt te da una vista unica y clara.",
  },
  {
    q: "Que diferencia hay entre una app especializada y hacer un Gantt en Excel?",
    a: "Un software de Gantt automatiza dependencias, fechas, colaboracion y reportes. En hojas de calculo esto se vuelve dificil de mantener rapidamente.",
  },
  { q: "Taskly es gratis?", a: "Taskly ofrece una prueba gratuita de 14 dias con acceso a funciones premium. Luego puedes elegir un plan de pago." },
  { q: "Puedo usar Taskly en cualquier dispositivo?", a: "Si. Taskly funciona en la nube y es compatible con navegadores modernos en escritorio, tablet y movil." },
  { q: "Ofrecen plantillas gratuitas de Gantt?", a: "Si, tenemos una libreria de plantillas gratuitas para diferentes industrias y casos de uso." },
  { q: "Puedo acceder al diagrama sin conexion?", a: "Puedes exportar tu diagrama a PDF, PNG o Excel y consultarlo sin conexion cuando quieras." },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-background py-20 animate-in fade-in duration-700">
      <div className="mx-auto max-w-[880px] px-6">
        <h2 className="text-center text-[28px] font-bold tracking-tight text-primary md:text-[32px]">
          Preguntas frecuentes sobre el generador de Gantt de Taskly
        </h2>

        <div className="mt-10 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-xl border border-border bg-secondary/50 transition-all duration-300 hover:shadow-sm"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-medium text-primary">{item.q}</span>
                  {isOpen ? (
                    <Minus className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  ) : (
                    <Plus className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-[14px] leading-relaxed text-muted-foreground">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
