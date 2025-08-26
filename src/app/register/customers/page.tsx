"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
// Context menu is provided via TableRow.contextMenuItems
import { useOrganization, useUser } from '@clerk/nextjs'
import type { Customer, CustomersListResponse } from '@/models/customer'

export default function CustomersPage() {
  const { isLoaded: userLoaded } = useUser()
  const { organization, isLoaded: orgLoaded } = useOrganization()

  const orgId = organization?.id

  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)

  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [saving, setSaving] = useState(false)

  const ready = userLoaded && orgLoaded

  useEffect(() => {
    if (!ready) return
    if (!orgId) {
      setLoading(false)
      setError('Select an organization to view customers.')
      return
    }

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/customers', { cache: 'no-store' })
        if (!res.ok) throw new Error((await res.json()).error || `HTTP ${res.status}`)
  const data = (await res.json()) as CustomersListResponse
        setCustomers(data.customers)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load customers'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [ready, orgId])

  const startCreate = () => {
    setEditing(null)
    setForm({ name: '', email: '', phone: '', notes: '' })
    setOpen(true)
  }

  const startEdit = (c: Customer) => {
    setEditing(c)
    setForm({ name: c.name || '', email: c.email || '', phone: c.phone || '', notes: c.notes || '' })
    setOpen(true)
  }

  const save = async () => {
    if (!orgId) return
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        email: form.email || undefined,
        phone: form.phone || undefined,
        notes: form.notes || undefined,
      }
      const res = await fetch(editing ? `/api/customers/${editing.id}` : '/api/customers', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed')
      // Refresh list
      const list = await fetch('/api/customers', { cache: 'no-store' })
  const data = (await list.json()) as CustomersListResponse
      setCustomers(data.customers)
      setOpen(false)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to save'
      alert(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (c: Customer) => {
    if (!orgId) return
    const confirmDelete = window.confirm(`Delete customer "${c.name}"?`)
    if (!confirmDelete) return
    try {
      const res = await fetch(`/api/customers/${c.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error((await res.json()).error || 'Delete failed')
      // Refresh list
      const list = await fetch('/api/customers', { cache: 'no-store' })
      const data = (await list.json()) as CustomersListResponse
      setCustomers(data.customers)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to delete'
      alert(msg)
    }
  }

  return (
    <div className="h-full w-full max-w-none flex flex-col space-y-4">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-semibold">Customers</h1>
          <p className="text-muted-foreground">Linked to your current Clerk organization.</p>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button onClick={startCreate}>New customer</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{editing ? 'Edit customer' : 'New customer'}</SheetTitle>
              <SheetDescription>Fill in the customer details and save.</SheetDescription>
            </SheetHeader>
            <div className="p-4 grid gap-3">
              <label className="grid gap-1">
                <span className="text-sm font-medium">Name</span>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Acme Inc."
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Email</span>
                <Input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="billing@acme.com"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Phone</span>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 555 000 0000"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium">Notes</span>
                <Input
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="VIP customer"
                />
              </label>
            </div>
            <SheetFooter className="p-4">
              <Button disabled={saving || !form.name.trim()} onClick={save} className="w-full">
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <Separator />
      {error && (
        <div role="alert" className="text-red-600">
          {error}
        </div>
      )}
        <div className="rounded border w-full max-w-none flex-1 min-h-0 overflow-auto">
          <Table loading={loading} skeletonRows={3}>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">No customers yet.</TableCell>
                </TableRow>
              )}
              {!loading && customers.map((c) => (
                <TableRow
                  key={c.id}
                  onDoubleClick={() => startEdit(c)}
                  className="cursor-default"
                  contextMenuItems={[
                    { label: 'Edit', onSelect: () => startEdit(c) },
                    { label: 'Delete', onSelect: () => handleDelete(c), className: 'text-red-600' },
                  ]}
                >
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.email || '-'}</TableCell>
                  <TableCell>{c.phone || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
    
    </div>
  )
}
