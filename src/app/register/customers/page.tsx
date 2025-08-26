"use client"

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useOrganization, useUser } from '@clerk/nextjs'
import type { Customer, CustomersListResponse } from '@/models/customer'

export default function CustomersPage() {
  const { isLoaded: userLoaded, user } = useUser()
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
      } catch (e: any) {
        setError(e.message || 'Failed to load customers')
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
    } catch (e: any) {
      alert(e.message || 'Failed to save')
    } finally {
      setSaving(false)
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
      {!ready && <p>Loading…</p>}
      {ready && !orgId && (
        <p className="text-muted-foreground">Please select an organization to manage customers.</p>
      )}
      {ready && orgId && (
        <div className="rounded border w-full max-w-none flex-1 min-h-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="w-[1%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={4}>Loading…</TableCell>
                </TableRow>
              )}
              {!loading && customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">No customers yet.</TableCell>
                </TableRow>
              )}
              {!loading && customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.email || '-'}</TableCell>
                  <TableCell>{c.phone || '-'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(c)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
