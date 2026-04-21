"use client"

import { useState } from "react"
import { X } from "lucide-react"

export function CookieBanner() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-[340px] rounded-xl bg-primary p-5 text-primary-foreground shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-500">
      <button
        aria-label="Cerrar"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 cursor-pointer text-primary-foreground/70 transition-colors duration-300 hover:text-primary-foreground"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="pr-6 text-[12px] leading-relaxed text-primary-foreground/90">
        Las cookies nos ayudan a ofrecer nuestros servicios. Al usar nuestros servicios, aceptas el uso
        de cookies.{" "}
        <a href="#" className="underline">
          Mas informacion en la Politica de privacidad
        </a>
        .
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="mt-3 w-full cursor-pointer rounded-md bg-accent px-4 py-2 text-[12px] font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/85"
      >
        Aceptar
      </button>
    </div>
  )
}
