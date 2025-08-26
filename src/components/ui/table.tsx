"use client"
import * as React from "react"

import { cn } from "@/lib/utils"

// Context menu types used by TableRow when providing row-specific actions
export type TableContextMenuItem = {
  label: string
  onSelect?: () => void
  disabled?: boolean
  className?: string
}

type TableMenuState = {
  open: boolean
  x: number
  y: number
  items: TableContextMenuItem[]
}

type TableContextValue = {
  openMenu: (e: React.MouseEvent, items: TableContextMenuItem[]) => void
  closeMenu: () => void
}

const TableContext = React.createContext<TableContextValue | null>(null)
function useTableContext() {
  const ctx = React.useContext(TableContext)
  if (!ctx) return null
  return ctx
}

function Table({ className, ...props }: React.ComponentProps<"table">) {
  const [menu, setMenu] = React.useState<TableMenuState>({ open: false, x: 0, y: 0, items: [] })

  const openMenu = React.useCallback((e: React.MouseEvent, items: TableContextMenuItem[]) => {
    e.preventDefault()
    setMenu({ open: true, x: e.clientX, y: e.clientY, items })
  }, [])

  const closeMenu = React.useCallback(() => setMenu((m) => ({ ...m, open: false })), [])

  React.useEffect(() => {
    if (!menu.open) return
    const onClick = () => closeMenu()
    const onEsc = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') closeMenu()
    }
    window.addEventListener('click', onClick)
    window.addEventListener('keydown', onEsc)
    return () => {
      window.removeEventListener('click', onClick)
      window.removeEventListener('keydown', onEsc)
    }
  }, [menu.open, closeMenu])

  return (
    <div className="relative w-full min-w-0 max-w-full overflow-x-auto">
      <TableContext.Provider value={{ openMenu, closeMenu }}>
        <table
          className={cn(
            // Small screens: auto layout; md+: fixed for consistent column sizes
            "min-w-[640px] w-full table-auto md:table-fixed caption-bottom text-sm",
            className
          )}
          {...props}
        />
        {menu.open && (
          <div
            className="bg-popover text-popover-foreground fixed z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md"
            style={{ left: menu.x, top: menu.y }}
            role="menu"
          >
            {menu.items.map((it, i) => (
              <button
                key={i}
                role="menuitem"
                disabled={it.disabled}
                className={cn(
                  "hover:bg-accent hover:text-accent-foreground flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-left text-sm outline-hidden disabled:pointer-events-none disabled:opacity-50",
                  it.className
                )}
                onClick={() => {
                  closeMenu()
                  it.onSelect?.()
                }}
              >
                {it.label}
              </button>
            ))}
          </div>
        )}
      </TableContext.Provider>
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
  <thead className={cn("[&_tr]:border-b sticky top-0 z-10 bg-background", className)} {...props} />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot className={cn("bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
  )
}

function TableRow(
  {
    className,
    contextMenuItems,
    onContextMenu,
    ...props
  }: React.ComponentProps<"tr"> & { contextMenuItems?: TableContextMenuItem[] }
) {
  const ctx = useTableContext()
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      onContextMenu={(e) => {
        onContextMenu?.(e)
        if (ctx && contextMenuItems && contextMenuItems.length) {
          ctx.openMenu(e, contextMenuItems)
        }
      }}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
  "text-muted-foreground h-10 px-3 py-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
  "px-3 py-2 align-middle break-words [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
