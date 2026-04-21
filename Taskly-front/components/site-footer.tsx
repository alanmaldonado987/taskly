import { Apple, Facebook, Play, Twitter, Linkedin, Youtube, Instagram } from "lucide-react"

const cols = [
  {
    title: "PRODUCTO",
    items: ["Por que nosotros", "Funciones", "Generador IA de Gantt", "Integraciones", "Novedades del producto", "Capacitacion", "Recursos de marca"],
  },
  {
    title: "COMPANIA",
    items: ["Nosotros", "Reconocimientos", "Historias de clientes", "Partners", "Programa de afiliados", "Programa de consultores", "Organizaciones sin fines de lucro"],
  },
  {
    title: "SOPORTE",
    items: ["Centro de ayuda", "Tutoriales en video", "Terminos de uso", "Politica de privacidad", "Anexo de procesamiento de datos", "Preferencias de cookies", "Seguridad"],
  },
  {
    title: "COMPARAR",
    items: ["vs Microsoft Project", "vs Excel", "vs Smartsheet", "vs Teamgantt", "vs Wrike"],
  },
  {
    title: "SOLUCIONES",
    items: ["Visor MPP online", "Software de planificacion de proyectos", "Herramienta de hitos", "Gestion y estimacion de recursos", "Integracion con Jira", "Planificador online", "Creador de EDT"],
  },
  {
    title: "PLANTILLAS",
    items: ["Plantillas de Gantt", "Plantilla de obra residencial", "Plantillas de marketing", "Ver todas"],
  },
  {
    title: "ARTICULOS DESTACADOS",
    items: [
      "Mejores alternativas a Microsoft Project",
      "Mejores plugins de Gantt para JIRA",
      "Mejores soluciones de Gantt para bootcamps",
      "Mejor software de gestion para Mac",
      "Ejemplos de diagramas de Gantt",
      "Como crear un Gantt en Microsoft Project",
      "Ejemplos de hitos de proyecto",
      "Ver todos",
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-white pt-14 text-primary animate-in fade-in duration-700">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-4">
          {cols.slice(0, 4).map((c) => (
            <div key={c.title}>
              <h4 className="text-[12px] font-bold tracking-wider text-primary">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.items.map((it) => (
                  <li key={it}>
                    <a href="#" className="text-[13px] text-muted-foreground transition-colors duration-300 hover:text-primary">
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-10 border-border" />

        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-4">
          {cols.slice(4).map((c) => (
            <div key={c.title}>
              <h4 className="text-[12px] font-bold tracking-wider text-primary">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.items.map((it) => (
                  <li key={it}>
                    <a href="#" className="text-[13px] text-muted-foreground transition-colors duration-300 hover:text-primary">
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-5 border-t border-border pt-8 pb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-3 text-[12px] font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5"
              >
                <Apple className="h-4 w-4" aria-hidden="true" />
                <div className="text-left leading-tight">
                  <div className="text-[9px] font-normal opacity-80">Descargalo en</div>
                  <div>App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-3 text-[12px] font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5"
              >
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                <div className="text-left leading-tight">
                  <div className="text-[9px] font-normal opacity-80">Disponible en</div>
                  <div>Google Play</div>
                </div>
              </a>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              <a href="#" aria-label="Facebook" className="hover:text-primary">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-primary">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-primary">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-primary">
                <Youtube className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-primary">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="text-right text-[11px] text-muted-foreground">
            <div>
                <a href="#" className="font-semibold text-primary hover:underline">
                soporte@taskly.com
              </a>
            </div>
            <div className="mt-1">XTRM Solutions Sp. z o.o., Polonia, IVA: PL8792273197</div>
            <div>+001-8001044075</div>
          </div>
        </div>

        <div className="border-t border-border py-5 text-center text-[11px] text-muted-foreground">
          © 2026 Taskly. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
