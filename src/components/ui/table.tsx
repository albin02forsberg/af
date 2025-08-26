"use client"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

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
  loading: boolean
  skeletonRows: number
  skeletonColumns: number
}

const TableContext = React.createContext<TableContextValue | null>(null)
function useTableContext() {
  const ctx = React.useContext(TableContext)
  if (!ctx) return null
  return ctx
}

type TableLoadingProps = {
  loading?: boolean
  skeletonRows?: number
  skeletonColumns?: number
}

function countColumnsFromChildren(children: React.ReactNode): number | null {
  const arr = React.Children.toArray(children)
  // Find our TableHeader, then first TableRow inside it
  for (const child of arr) {
    if (React.isValidElement(child) && child.type === TableHeader) {
      const ch = child as React.ReactElement<{ children?: React.ReactNode }>
      const headerChildren = React.Children.toArray(ch.props.children)
      for (const hChild of headerChildren) {
        if (React.isValidElement(hChild) && hChild.type === TableRow) {
          const hh = hChild as React.ReactElement<{ children?: React.ReactNode }>
          const rowChildren = React.Children.toArray(hh.props.children)
          const count = rowChildren.filter((c) => React.isValidElement(c) && (c.type === TableHead || c.type === TableCell)).length
          if (count > 0) return count
        }
      }
    }
  }
  return null
}

function Table({ className, children, loading = false, skeletonRows = 3, skeletonColumns, ...props }: React.ComponentProps<"table"> & TableLoadingProps) {
  const [menu, setMenu] = React.useState<TableMenuState>({ open: false, x: 0, y: 0, items: [] })
  const inferredCols = React.useMemo(() => countColumnsFromChildren(children) ?? undefined, [children])
  const skCols = skeletonColumns ?? inferredCols ?? 3

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
      <TableContext.Provider value={{ openMenu, closeMenu, loading, skeletonRows, skeletonColumns: skCols }}>
        <table
          className={cn(
            // Small screens: auto layout; md+: fixed for consistent column sizes
            "min-w-[640px] w-full table-auto md:table-fixed caption-bottom text-sm",
            className
          )}
          {...props}
        >
          {children}
        </table>
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
TableHeader.displayName = 'TableHeader'

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  const ctx = useTableContext()
  if (ctx?.loading) {
    return (
      <tbody className={cn("[&_tr:last-child]:border-0", className)}>
        {Array.from({ length: ctx.skeletonRows }).map((_, r) => (
          <tr key={r} className="border-b">
            {Array.from({ length: ctx.skeletonColumns }).map((__, c) => (
              <td key={c} className={cn("px-3 py-2 align-middle", c === 0 ? "w-1/3" : "")}> 
                <Skeleton className="h-4 w-full" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    )
  }
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
        // If table is in loading state, do nothing special
        if (ctx?.loading) return
        e.preventDefault()
        onContextMenu?.(e)
        if (ctx && contextMenuItems && contextMenuItems.length) {
          ctx.openMenu(e, contextMenuItems)
        }
      }}
      {...props}
    />
  )
}
TableRow.displayName = 'TableRow'

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
TableHead.displayName = 'TableHead'

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
TableCell.displayName = 'TableCell'

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
