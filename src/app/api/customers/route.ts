import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/firebase'
import { addDoc, collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import type { ApiError, Customer, CustomerCreate, CustomerDoc, CustomersListResponse } from '@/models/customer'

// GET /api/customers - list customers for current org
export async function GET() {
  const { orgId, userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' } satisfies ApiError, { status: 401 })
  if (!orgId) return NextResponse.json({ error: 'No organization selected' } satisfies ApiError, { status: 400 })

  try {
  const col = collection(db, 'organizations', orgId, 'customers')
  const q = query(col, orderBy('updatedAt', 'desc'), limit(100))
  const snap = await getDocs(q)
  const customers: Customer[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as CustomerDoc) }))
    return NextResponse.json({ customers } satisfies CustomersListResponse)
  } catch (err: any) {
    console.error('GET /api/customers error', err)
    return NextResponse.json({ error: 'Failed to load customers' } satisfies ApiError, { status: 500 })
  }
}

// POST /api/customers - create customer
export async function POST(req: Request) {
  const { orgId, userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' } satisfies ApiError, { status: 401 })
  if (!orgId) return NextResponse.json({ error: 'No organization selected' } satisfies ApiError, { status: 400 })

  const body = await req.json().catch(() => null)
  const { name, email, phone, notes } = (body ?? {}) as CustomerCreate

  if (!name?.trim()) return NextResponse.json({ error: 'Name is required' } satisfies ApiError, { status: 400 })

  try {
    const now = Date.now()
    const docRef = await addDoc(collection(db, 'organizations', orgId, 'customers'), {
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      notes: notes?.trim() || null,
      createdAt: now,
      updatedAt: now,
      orgId,
    } satisfies CustomerDoc)

    // Read back to return full data (optional; could also echo payload)
    return NextResponse.json(
      {
        id: docRef.id,
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        notes: notes?.trim() || null,
        createdAt: now,
        updatedAt: now,
        orgId,
      } as Customer,
      { status: 201 }
    )
  } catch (err: any) {
    console.error('POST /api/customers error', err)
    return NextResponse.json({ error: 'Failed to create customer' } satisfies ApiError, { status: 500 })
  }
}
