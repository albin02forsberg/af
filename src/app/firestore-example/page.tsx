"use client"

import { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function FirestoreExamplePage() {
  type Item = { id: string; [k: string]: unknown }
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
  const res = await fetch('/api/examples', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = (await res.json()) as { items: Item[] }
        setItems(data.items)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold">Firestore Example</h1>
      <p className="text-muted-foreground mt-2">
        Reading last 10 docs from collection <code>examples</code>.
      </p>
      <Separator className="my-4" />
      {loading && <p>Loading…</p>}
      {error && (
        <p className="text-red-600">
          {error}
        </p>
      )}
      {!loading && !error && (
        <ScrollArea className="h-80 rounded border p-3">
          <ul className="space-y-2">
            {items.length === 0 && <li className="text-muted-foreground">No documents found.</li>}
            {items.map((it) => (
              <li key={it.id} className="text-sm">
                <pre className="whitespace-pre-wrap break-words bg-muted p-2 rounded">{JSON.stringify(it, null, 2)}</pre>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </div>
  )
}
