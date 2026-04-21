"use client"

import Link from "next/link"
import { ChevronDown, Globe } from "lucide-react"

const nav = [
  { label: "Producto", hasMenu: true },
  { label: "Generador IA de Gantt", hasMenu: false },
  { label: "Planes", hasMenu: true },
  { label: "Precios", hasMenu: false },
  { label: "Demo", hasMenu: false },
]

export function SiteHeader() {
  return (
    <header className="w-full bg-secondary animate-in fade-in duration-500">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-1.5" aria-label="Taskly">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="4" width="8" height="3" rx="1" fill="#134636" />
              <rect x="6" y="10" width="12" height="3" rx="1" fill="#134636" />
              <rect x="10" y="16" width="8" height="3" rx="1" fill="#134636" />
            </svg>
            <span className="text-[17px] font-bold tracking-tight text-primary">TASKLY</span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((item) => (
              <button
                key={item.label}
                className="flex cursor-pointer items-center gap-1 text-[14px] font-medium text-primary/90 transition-colors duration-300 hover:text-primary"
              >
                {item.label}
                {item.hasMenu && <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <button className="hidden cursor-pointer items-center gap-1 text-[14px] font-medium text-primary/90 transition-colors duration-300 hover:text-primary md:flex">
            <Globe className="h-4 w-4" aria-hidden="true" />
            EN
            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <Link
            href="#"
            className="hidden text-[14px] font-medium text-primary/90 hover:text-primary md:inline"
          >
            Contactar ventas
          </Link>
          <Link
            href="#"
            className="text-[14px] font-medium text-primary/90 hover:text-primary"
          >
            Iniciar sesion
          </Link>
          <Link
            href="#"
            className="rounded-md bg-primary px-4 py-2 text-[14px] font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Registrate gratis
          </Link>
        </div>
      </div>
    </header>
  )
}
