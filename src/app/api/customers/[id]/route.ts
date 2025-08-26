import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/firebase'
import type { ApiError, Customer, CustomerDoc, CustomerUpdate } from '@/models/customer'
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'

// PATCH /api/customers/[id] - update customer fields
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { orgId, userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' } satisfies ApiError, { status: 401 })
  if (!orgId) return NextResponse.json({ error: 'No organization selected' } satisfies ApiError, { status: 400 })

  const body = await req.json().catch(() => null)
  const { name, email, phone, notes } = (body ?? {}) as CustomerUpdate

  if (name !== undefined && !name.trim()) {
    return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 })
  }

  try {
  const ref = doc(db, 'organizations', orgId, 'customers', params.id)

  const update: Record<string, unknown> = { updatedAt: Date.now() }
    if (name !== undefined) update.name = name.trim()
    if (email !== undefined) update.email = email?.trim() || null
    if (phone !== undefined) update.phone = phone?.trim() || null
    if (notes !== undefined) update.notes = notes?.trim() || null

  await setDoc(ref, update, { merge: true })
  const snap = await getDoc(ref)
  if (!snap.exists()) return NextResponse.json({ error: 'Not found' } satisfies ApiError, { status: 404 })

  const data = snap.data() as CustomerDoc
  return NextResponse.json({ id: snap.id, ...data } as Customer)
  } catch (err) {
    console.error('PATCH /api/customers/[id] error', err)
    return NextResponse.json({ error: 'Failed to update customer' } satisfies ApiError, { status: 500 })
  }
}

// DELETE /api/customers/[id] - delete customer
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { orgId, userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' } satisfies ApiError, { status: 401 })
  if (!orgId) return NextResponse.json({ error: 'No organization selected' } satisfies ApiError, { status: 400 })

  try {
    const ref = doc(db, 'organizations', orgId, 'customers', params.id)
    await deleteDoc(ref)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/customers/[id] error', err)
  return NextResponse.json({ error: 'Failed to delete customer' } satisfies ApiError, { status: 500 })
  }
}
