"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type MenuItem = {
  label: string
  onSelect?: () => void
  disabled?: boolean
  className?: string
}

type ContextMenuProps = {
  items: MenuItem[]
  children: React.ReactNode
}

// Lightweight context menu without external deps
export function SimpleContextMenu({ items, children }: ContextMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [pos, setPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const onGlobalClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (open && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('click', onGlobalClick)
    window.addEventListener('contextmenu', onGlobalClick)
    window.addEventListener('keydown', onEsc)
    return () => {
      window.removeEventListener('click', onGlobalClick)
      window.removeEventListener('contextmenu', onGlobalClick)
      window.removeEventListener('keydown', onEsc)
    }
  }, [open])

  return (
    <div
      ref={containerRef}
      className="relative"
      onContextMenu={(e) => {
        e.preventDefault()
        setPos({ x: e.clientX, y: e.clientY })
        setOpen(true)
      }}
    >
      {children}
      {open && (
        <div
          className="bg-popover text-popover-foreground fixed z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md"
          style={{ left: pos.x, top: pos.y }}
          role="menu"
        >
          {items.map((it, idx) => (
            <button
              key={idx}
              role="menuitem"
              disabled={it.disabled}
              className={cn(
                "hover:bg-accent hover:text-accent-foreground flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-left text-sm outline-hidden disabled:pointer-events-none disabled:opacity-50",
                it.className
              )}
              onClick={() => {
                setOpen(false)
                it.onSelect?.()
              }}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
